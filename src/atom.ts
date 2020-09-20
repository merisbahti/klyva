import { Lens, get, set, Equivalence, Iso, Getter } from 'optics-ts'
import { BehaviorSubject, merge, Observable } from 'rxjs'
import { map, distinctUntilChanged, mergeMap, take } from 'rxjs/operators'
import equal from 'deep-equal'
import { Atom, ReadOnlyAtom, DerivedAtomReader, RwFocus } from './types'
import observeForOneValue from './observe-for-one-value'

export function atom<S>(value: DerivedAtomReader<S>): ReadOnlyAtom<S>
export function atom<S>(value: S): Atom<S>

export function atom<S>(value: S | DerivedAtomReader<S>) {
  if (value instanceof Function) {
    return derivedAtom(value)
  }
  const atom$ = new BehaviorSubject<S>(value)
  const next = (next: S) => atom$.next(next)
  const getValue = () => atom$.value

  return atomConstructor(atom$, getValue, next)
}

export const derivedAtom = <S>(read: DerivedAtomReader<S>): ReadOnlyAtom<S> => {
  const getter = (onDependency: (newAtom: Atom<any>) => void) => <A>(
    a: Atom<A>,
  ) => {
    onDependency(a)
    return a.getValue()
  }

  const computeDerivedValue = () => {
    const dependantAtoms: Set<Atom<unknown>> = new Set()
    const onDependency = (atom: Atom<unknown>) => dependantAtoms.add(atom)
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

  const latestValueRef = { value: initialValue }

  const behaviorSubject = new BehaviorSubject(dependencyObserver)
  const atom$ = behaviorSubject.pipe(
    mergeMap(value => {
      return value
    }),
    map(_value => {
      const { computedValue, dependencyObserver } = computeDerivedValue()
      behaviorSubject.next(dependencyObserver)
      latestValueRef.value = computedValue
      return computedValue
    }),
    distinctUntilChanged(equal),
  )

  const getValue = () => {
    return latestValueRef.value
  }

  const subscribe = (listener: (value: S) => void) => {
    const subscription = atom$.subscribe(listener)
    return subscription.unsubscribe
  }

  return roAtomConstructor(atom$, getValue, subscribe)
}
const atomConstructor = <S>(
  atom$: Observable<S>,
  getValue: () => S,
  next: (value: S) => void,
): Atom<S> => {
  const atom: Atom<S> = {
    subscribe: constructSubscribe(atom$),
    focus: constructFocus(atom$, getValue, next),
    update: constructUpdater(next, getValue),
    getValue,
  }
  return atom
}
const roAtomConstructor = <S>(
  atom$: Observable<S>,
  getValue: () => S,
  subscribe: (listener: (value: S) => void) => () => void,
): ReadOnlyAtom<S> => {
  const readOnlyAtom: ReadOnlyAtom<S> = {
    subscribe: subscribe,
    focus: constructReadOnlyFocus(atom$, getValue),
    getValue,
  }
  return readOnlyAtom
}
const constructSubscribe = <S>(atom$: Observable<S>) => (
  listener: (value: S) => void,
): (() => void) => {
  const sub = atom$.subscribe(next => listener(next))
  return sub.unsubscribe
}
const constructFocus = <S>(
  atom$: Observable<S>,
  getValue: () => S,
  next: (value: S) => void,
): RwFocus<S> => <A>(
  optic:
    | Lens<S, any, A>
    | Equivalence<S, any, A>
    | Iso<S, any, A>
    | Getter<S, A>,
): any => {
  if (optic._tag === 'Getter') {
    return constructReadOnlyFocus(atom$, getValue)(optic)
  }
  const getter = get(optic)

  const newAtom$ = atom$.pipe(map(getter), distinctUntilChanged(equal))

  const newValue = () => get(optic)(getValue())

  const newNext = (nextA: A) => {
    next(set(optic)(nextA)(getValue()))
  }

  const rwAtom: Atom<A> = atomConstructor(newAtom$, newValue, newNext)
  return rwAtom
}

const constructReadOnlyFocus = <S>(atom$: Observable<S>, getValue: () => S) => <
  A
>(
  optic: Getter<S, A>,
) => {
  const getter = get(optic)
  const newAtom$ = atom$.pipe(map(getter), distinctUntilChanged(equal))
  const newValue = () => get(optic)(getValue())

  return roAtomConstructor(newAtom$, newValue, constructSubscribe(newAtom$))
}

const constructUpdater = <A>(next: (value: A) => void, getValue: () => A) => (
  updater: A | ((oldValue: A) => A),
): void => {
  const newValue = updater instanceof Function ? updater(getValue()) : updater
  next(newValue)
}
