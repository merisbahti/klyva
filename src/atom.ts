import { BehaviorSubject, merge, Observable } from 'rxjs'
import { tap, take, share, skip, mergeMap } from 'rxjs/operators'
import { Atom, ReadableAtom, DerivedAtomReader, SetState } from './types'
import observeForOneValue from './observe-for-one-value'
import equal from './equal'

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

  const subject = new BehaviorSubject<Value>(read)
  const getValue = () => subject.getValue()
  const obs = subject.pipe(skip(1), share())

  const subscribe = (listener: (value: Value) => void) => {
    const unsub = obs.subscribe(listener)
    return () => unsub.unsubscribe()
  }
  const next = (next: SetState<Value>) => {
    const nextValue = next instanceof Function ? next(getValue()) : next
    // Instead of distinctUntilChanged(equal), we do the check here so
    // that the latest value from the stream (obs) and subject.getValue()
    // are the same reference
    if (!equal(nextValue, subject.getValue())) subject.next(nextValue)
  }

  return atomConstructor(subscribe, getValue, next)
}

const derivedAtom = <Value, Update>(
  read: DerivedAtomReader<Value>,
  write?: (update: Update) => void,
): ReadableAtom<Value> => {
  const getter = (onDependency: (newAtom: ReadableAtom<any>) => void) => <A>(
    a: ReadableAtom<A>,
  ) => {
    onDependency(a)
    return a.getValue()
  }

  const getValueAndObserver = () => {
    const dependantAtoms: Array<ReadableAtom<unknown>> = []
    const onDependency = (atom: ReadableAtom<unknown>) =>
      dependantAtoms.push(atom)
    const computedValue = read(getter(onDependency))
    // Then we want to listen to changes for these ones
    // but we want to ignore the first value!
    const observables = Array.from(dependantAtoms).map(observeForOneValue)
    // Out of all dependants, if just one changes, we want to complete the stream
    const dependencyObserver = merge(...observables).pipe(take(1))

    return { computedValue, dependencyObserver } as const
  }

  const {
    computedValue: initialValue,
    dependencyObserver: initialDependencyObserver,
  } = getValueAndObserver()

  const dependencyObserverSubject = new BehaviorSubject<Observable<unknown>>(
    initialDependencyObserver,
  )
  const valueSubject = new BehaviorSubject<Value>(initialValue)

  const dependencyObserver$ = dependencyObserverSubject.pipe(
    mergeMap(dependencyObserver => dependencyObserver),
    tap(() => {
      const { computedValue, dependencyObserver } = getValueAndObserver()
      dependencyObserverSubject.next(dependencyObserver)
      if (!equal(computedValue, valueSubject.getValue()))
        valueSubject.next(computedValue)
    }),
    skip(1),
    share(),
  )

  const value$ = valueSubject.pipe(skip(1), share())

  const getValue = () => valueSubject.getValue()

  const subscribe = (listener: (value: Value) => void) => {
    const valueSubscription = value$.subscribe(listener)
    const dependencySubscription = dependencyObserver$.subscribe()
    return () => {
      dependencySubscription.unsubscribe()
      valueSubscription.unsubscribe()
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
