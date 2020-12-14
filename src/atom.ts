import cbSubscribe from 'callbag-subscribe'
import cbTap from 'callbag-tap'
import cbTake from 'callbag-take'
import cbSkip from 'callbag-skip'
import cbShare from 'callbag-share'
import cbPipe from 'callbag-pipe'
import cbMergeMap from 'callbag-merge-map'
import cbMerge from 'callbag-merge'
import { Atom, ReadableAtom, DerivedAtomReader, SetState } from './types'
import { atomToSource } from './atom-to-source'
import equal from './equal'
import { Source } from 'callbag'
import behaviorSubject from './behavior-subject'

let resetVersion = 0

const resetListeners: Array<() => void> = []
const subscribeToResets = (listener: () => void) => {
  resetListeners.push(listener)
  const unsubscribe = () => {
    const myIndex = resetListeners.indexOf(listener)
    resetListeners.splice(myIndex, 1)
  }
  return unsubscribe
}

export const resetAll = () => {
  resetVersion++
  resetListeners.forEach(resetListener => resetListener())
}

export function atom<Value, Update>(
  value: DerivedAtomReader<Value>,
  write: (update: Update) => void,
): Atom<Value, Update>

// for some reason we're not allowed to make variadic functions
// eslint-disable-next-line no-redeclare
export function atom<Value>(
  value: DerivedAtomReader<Value>,
): ReadableAtom<Value>

// eslint-disable-next-line no-redeclare
export function atom<Value>(value: Value): Atom<Value, SetState<Value>>

// eslint-disable-next-line no-redeclare
export function atom<Value, Update = unknown>(
  read: Value | DerivedAtomReader<Value>,
  write?: (update: Update) => void,
) {
  if (read instanceof Function) {
    return derivedAtom(read, write)
  }

  let currentResetVersion = resetVersion

  const subject = behaviorSubject(read)

  const maybeResetValue = () => {
    if (resetVersion !== currentResetVersion) {
      const initialValue = read
      subject(1, initialValue)
      currentResetVersion = resetVersion
    }
  }

  const getValue = () => {
    maybeResetValue()
    return subject.getValue()
  }

  const obs = cbPipe(subject, cbSkip(1), cbShare)

  const subscribe: Subscribe<Value> = listener => {
    const unsub = cbSubscribe(listener)(obs)
    const unsubListeners = subscribeToResets(maybeResetValue)
    return () => {
      unsub()
      unsubListeners()
    }
  }
  const next = (next: SetState<Value>) => {
    const nextValue = next instanceof Function ? next(getValue()) : next
    // Instead of distinctUntilChanged(equal), we do the check here so
    // that the latest value from the stream (obs) and subject.getValue()
    // are the same reference
    if (!equal(nextValue, getValue())) {
      subject(1, nextValue)
    }
  }

  return atomConstructor(subscribe, getValue, next)
}

const derivedAtom = <Value, Update>(
  read: DerivedAtomReader<Value>,
  write?: (update: Update) => void,
): ReadableAtom<Value> => {
  const getter = (
    onDependency: (dep: {
      atom: ReadableAtom<unknown>
      value: unknown
    }) => void,
  ) => <A>(atom: ReadableAtom<A>) => {
    const value = atom.getValue()
    onDependency({ atom, value })
    return value
  }

  const dependencies: Array<ReadableAtom<unknown>> = []
  const dependencyValueCache: Array<unknown> = []

  const getValueAndObserver = () => {
    dependencies.length = 0
    dependencyValueCache.length = 0
    const onDependency = ({
      atom,
      value,
    }: {
      atom: ReadableAtom<unknown>
      value: unknown
    }) => {
      dependencies.push(atom)
      dependencyValueCache.push(value)
    }
    const computedValue = read(getter(onDependency))
    // Then we want to listen to changes for these ones
    // but we want to ignore the first value!
    const sources = Array.from(dependencies).map(atomToSource)
    // Out of all dependants, if just one changes, we want to complete the stream
    const dependencyObserver = cbPipe(cbMerge(...sources), cbTake(1))

    return { computedValue, dependencyObserver } as const
  }

  const {
    computedValue: initialValue,
    dependencyObserver: initialDependencySource,
  } = getValueAndObserver()

  const dependencyObserverSubject = behaviorSubject<Source<unknown>>(
    initialDependencySource,
  )
  const valueSubject = behaviorSubject<Value>(initialValue)

  const recalculateValue = () => {
    const { computedValue, dependencyObserver } = getValueAndObserver()
    dependencyObserverSubject(1, dependencyObserver)
    if (!equal(computedValue, getValue())) {
      valueSubject(1, computedValue)
    }
  }

  const dependencyObserver$ = cbPipe(
    dependencyObserverSubject,
    cbMergeMap(dependencyObserver => dependencyObserver),
    cbTap(recalculateValue),
    cbSkip(1),
    cbShare,
  )

  const value$ = cbPipe(valueSubject, cbSkip(1), cbShare)

  const getValue = () => {
    const dependenciesChanged = dependencyValueCache.some(
      (cachedValue, index) =>
        !equal(cachedValue, dependencies[index].getValue()),
    )
    if (dependenciesChanged) recalculateValue()
    return valueSubject.getValue()
  }

  const subscribe: Subscribe<Value> = listener => {
    const valueSubscription = cbSubscribe(listener)(value$)
    const dependencySubscription = cbSubscribe(() => {})(dependencyObserver$)
    return () => {
      dependencySubscription()
      valueSubscription()
    }
  }

  return atomConstructor(subscribe, getValue, write)
}

// Make this a better construcor, if update is set, it should be a RW atom, but if not, it should always return a ReadOnly atom
const atomConstructor = <Value, Updater>(
  subscribe: Subscribe<Value>,
  getValue: () => Value,
  update?: (updater: Updater) => void,
) => {
  if (update) {
    const atom: Atom<Value, Updater> = {
      subscribe,
      update,
      getValue,
    }
    return atom
  } else {
    const readOnlyAtom: ReadableAtom<Value> = {
      subscribe: subscribe,
      getValue,
    }
    return readOnlyAtom
  }
}

type Subscribe<S> = (listener: (value: S) => void) => () => void
