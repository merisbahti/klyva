import { BehaviorSubject, merge, Observable } from 'rxjs'
import { map, distinctUntilChanged, mergeMap, take, tap } from 'rxjs/operators'
import equal from 'deep-equal'
import { Atom, ReadableAtom, DerivedAtomReader, SetState } from './types'
import observeForOneValue from './observe-for-one-value'

export function atom<Value>(
  value: DerivedAtomReader<Value>,
): ReadableAtom<Value>
export function atom<Value, Update>(
  value: DerivedAtomReader<Value>,
  write: (update: Update) => void,
): Atom<Value, Update>
export function atom<Value>(value: Value): Atom<Value, SetState<Value>>

export function atom<Value, Update = unknown>(
  read: Value | DerivedAtomReader<Value>,
  write?: (update: Update) => void,
) {
  if (read instanceof Function) {
    return derivedAtom(read, write)
  }

  const atom$ = new BehaviorSubject<Value>(read)
  const getValue = () => atom$.value
  const next = (next: SetState<Value>) =>
    next instanceof Function ? atom$.next(next(getValue())) : atom$.next(next)

  return atomConstructor(constructSubscribe(atom$), getValue, next)
}

export const derivedAtom = <Value, Update>(
  read: DerivedAtomReader<Value>,
  write?: (update: Update) => void,
): ReadableAtom<Value> => {
  const getter = (onDependency: (newAtom: ReadableAtom<any>) => void) => <A>(
    a: ReadableAtom<A>,
  ) => {
    onDependency(a)
    return a.getValue()
  }

  const computeDerivedValue = () => {
    const dependantAtoms: Set<ReadableAtom<unknown>> = new Set()
    const onDependency = (atom: ReadableAtom<unknown>) =>
      dependantAtoms.add(atom)
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
    dependencyObserver,
  } = computeDerivedValue()

  const dependencyObserverSubject = new BehaviorSubject(dependencyObserver)
  const atom$ = dependencyObserverSubject.pipe(
    mergeMap(dependencyObserver => dependencyObserver),
    map(_value => {
      const { computedValue, dependencyObserver } = computeDerivedValue()
      dependencyObserverSubject.next(dependencyObserver)
      console.log('_value', _value)
      console.log('computedValue', computedValue)
      return computedValue
    }),
    tap((newValue: Value) => {
      console.log('got new value newValue', newValue)
      valueSubject.next(newValue)
    }),
  )

  const valueSubject = new BehaviorSubject(initialValue)
  const valueStream = valueSubject.pipe(distinctUntilChanged(equal))

  const getValue = () => {
    return valueSubject.getValue()
  }

  const subscribe = (listener: (value: Value) => void) => {
    const valueSubscription = valueStream.subscribe(listener)
    const dependencySubscription = atom$.subscribe()
    valueSubscription.add(() => {
      dependencySubscription.unsubscribe()
    })
    return () => valueSubscription.unsubscribe()
  }

  return atomConstructor(subscribe, getValue, write)
}
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

const constructSubscribe = <S>(
  atom$: Observable<S>,
): Subscribe<S> => listener => {
  const sub = atom$.subscribe(next => listener(next))
  return () => {
    sub.unsubscribe()
  }
}
