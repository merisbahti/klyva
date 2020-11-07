import { BehaviorSubject, merge, Observable } from 'rxjs'
import {
  map,
  distinctUntilChanged,
  tap,
  skip,
  filter,
  take,
  switchMap,
} from 'rxjs/operators'
import { Atom, ReadableAtom, DerivedAtomReader, SetState } from './types'
import observeForOneValue from './observe-for-one-value'
import equal from './equal'

export function atom<Value, Update>(
  value: DerivedAtomReader<Value>,
  write: (update: Update) => void,
): Atom<Value, Update>
export function atom<Value>(
  value: DerivedAtomReader<Value>,
): ReadableAtom<Value>
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

  return atomConstructor(
    constructSubscribe(atom$.pipe(skip(1))),
    getValue,
    next,
  )
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

  const getValueAndObserver = () => {
    const dependantAtoms: Set<ReadableAtom<unknown>> = new Set()
    const onDependency = (atom: ReadableAtom<unknown>) =>
      dependantAtoms.add(atom)
    const computedValue = read(getter(onDependency))
    // Then we want to listen to changes for these ones
    // but we want to ignore the first value!
    const observables = Array.from(dependantAtoms).map(observeForOneValue)
    // Out of all dependants, if just one changes, we want to complete the stream
    console.log(
      'Adding observer for dependency',
      Array.from(dependantAtoms).map(x => x.getValue()),
    )
    const dependencyObserver = merge(...observables).pipe(take(1))

    return { computedValue, dependencyObserver } as const
  }

  const {
    computedValue: initialValue,
    dependencyObserver,
  } = getValueAndObserver()

  const dependencyObserverSubject = new BehaviorSubject(dependencyObserver)
  const dependencyObserver$ = dependencyObserverSubject.pipe(
    switchMap(dependencyObserver => dependencyObserver),
    map(_updatedDependencyValue => {
      const { computedValue, dependencyObserver } = getValueAndObserver()
      dependencyObserverSubject.next(dependencyObserver)
      console.log('new computed value', {
        _updatedDependencyValue,
        computedValue,
      })
      return computedValue
    }),
    filter(newValue => !equal(newValue, cachedValue)),
    tap((newValue: Value) => {
      cachedValue = newValue
    }),
  )

  let cachedValue = initialValue

  const getValue = () => {
    return cachedValue
  }

  const subscribe = (listener: (value: Value) => void) => {
    const dependencySubscription = dependencyObserver$.subscribe(newValue => {
      console.log('sending new value down', newValue)
      listener(newValue)
    })
    return () => dependencySubscription.unsubscribe()
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

const constructSubscribe = <S>(
  atom$: Observable<S>,
): Subscribe<S> => listener => {
  const sub = atom$
    .pipe(distinctUntilChanged(equal))
    .subscribe(next => listener(next))
  return () => {
    sub.unsubscribe()
  }
}
