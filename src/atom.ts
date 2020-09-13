import { Lens, get, set, Equivalence, Iso, Getter } from 'optics-ts'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, distinctUntilChanged } from 'rxjs/operators'
import equal from 'deep-equal'

export type Atom<S> = {
  subscribe: (listener: (value: S) => void) => () => void

  focus<A>(
    optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
  ): Atom<A>
  focus<A>(optic: Getter<S, A>): ReadOnlyAtom<A>

  update: (updater: S | ((oldValue: S) => S)) => void
  getValue: () => S
}

export type ReadOnlyAtom<S> = {
  subscribe: (listener: (value: S) => void) => void
  focus<A>(optic: Getter<S, A>): ReadOnlyAtom<A>
  getValue: () => S
}

type AtomGetter = <Value>(atom: Atom<Value>) => Value
export type DerivedAtomReader<S> = (read: AtomGetter) => S

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
  const dependencies = new Map<Atom<any>, () => void>()

  const getter: AtomGetter = <A>(a: Atom<A>) => {
    if (!dependencies.get(a)) {
      const unsubscribe = a.subscribe(() => {
        behaviorSubject.next('signal')
      })
      dependencies.set(a, unsubscribe)
    }
    return a.getValue()
  }

  const behaviorSubject = new BehaviorSubject<'signal'>('signal')
  const atom$ = behaviorSubject.pipe(
    map(() => read(getter)),
    distinctUntilChanged(equal),
  )

  const subscribe = (listener: (value: S) => void) => {
    const subscription = atom$.subscribe(listener)
    subscription.add(() => {
      Object.values(dependencies).forEach(unsubscribe => {
        unsubscribe()
      })
    })
    return subscription.unsubscribe
  }

  return roAtomConstructor(atom$, () => read(getter), subscribe)
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

type RwFocus<S> = {
  <A>(optic: Getter<S, A>): ReadOnlyAtom<S>
  <A>(optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>): Atom<S>
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
