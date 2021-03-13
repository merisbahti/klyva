import cbSubscribe from 'callbag-subscribe'
import cbShare from 'callbag-share'
import cbMerge from 'callbag-merge'
import { Atom, ReadableAtom, DerivedAtomReader, Updater, CustomAtom } from './'
import { atomToSource } from './atom-to-source'
import equal from './equal'
import cachedSubject from './cached-subject'
import take from 'callbag-take'

export function atom<Value, Update>(
  value: DerivedAtomReader<Value>,
  write: (update: Update) => void,
): CustomAtom<Value, Update>

export function atom<Value>(
  value: DerivedAtomReader<Value>,
): ReadableAtom<Value>
export function atom<Value>(value: Value): Atom<Value>
export function atom<Value, Update = unknown>(
  read: Value | DerivedAtomReader<Value>,
  write?: (update: Update) => void,
) {
  if (read instanceof Function) {
    return derivedAtom(read, write)
  }

  const subject = cachedSubject(read)
  const getValue = subject.getValue

  const obs = cbShare(subject)

  const subscribe: Subscribe<Value> = listener => {
    const unsub = cbSubscribe(listener)(obs)
    return () => unsub()
  }
  const next = (next: Updater<Value>) => {
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
    const dependencyObserver = take(1)(cbMerge(...sources))

    return { computedValue, dependencyObserver } as const
  }

  const { computedValue: initialValue } = getValueAndObserver()

  const valueSubject = cachedSubject<Value>(initialValue)

  const recalculateValue = () => {
    const { computedValue, dependencyObserver } = getValueAndObserver()
    if (subs !== 0) {
      dependencySubscription?.()
      dependencySubscription = cbSubscribe(recalculateValue)(dependencyObserver)
    }
    if (!equal(computedValue, getValue())) {
      valueSubject(1, computedValue)
    }
  }

  const value$ = cbShare(valueSubject)

  let dependencySubscription: null | (() => void) = null

  const getValue = () => {
    const dependenciesChanged = dependencyValueCache.some(
      (cachedValue, index) =>
        !equal(cachedValue, dependencies[index].getValue()),
    )
    if (dependenciesChanged) recalculateValue()
    return valueSubject.getValue()
  }

  let subs = 0
  const subscribe: Subscribe<Value> = listener => {
    const valueSubscription = cbSubscribe(listener)(value$)
    if (subs === 0) {
      const { dependencyObserver } = getValueAndObserver()
      dependencySubscription?.()
      dependencySubscription = cbSubscribe(recalculateValue)(dependencyObserver)
    }
    let hasUnsubbed = false
    subs++
    return () => {
      if (hasUnsubbed) return
      hasUnsubbed = true
      subs--
      if (subs === 0) {
        dependencySubscription?.()
        dependencySubscription = null
      }
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
    const atom: CustomAtom<Value, Updater> = {
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
