import { Lens, get, set, Equivalence, Iso } from 'optics-ts'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, distinctUntilChanged } from 'rxjs/operators'
import equal from 'deep-equal'

export type Atom<S> = {
  subscribe: (listener: (value: S) => void) => void
  focus: <A>(
    optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
  ) => Atom<A>
  update: (updater: S | ((oldValue: S) => S)) => void
  getValue: () => S
}

export type ReadOnlyAtom<S> = Omit<Atom<S>, 'update'>

export const atom = <S>(value: S): Atom<S> => {
  const atom$ = new BehaviorSubject<S>(value)
  const next = (next: S) => atom$.next(next)
  const getValue = () => atom$.value

  return atomConstructor(atom$, next, getValue)
}

const atomConstructor = <S>(
  atom$: Observable<S>,
  next: (value: S) => void,
  getValue: () => S,
): Atom<S> => ({
  subscribe: constructSubscribe(atom$),
  focus: constructFocus(next, getValue, atom$),
  update: constructUpdater(next, getValue),
  getValue,
})

const constructSubscribe = <S>(atom$: Observable<S>) => (
  listener: (value: S) => void,
): void => {
  atom$.subscribe(next => listener(next))
}

const constructFocus = <S>(
  next: (value: S) => void,
  getValue: () => S,
  atom$: Observable<S>,
) => <A>(
  optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
): Atom<A> => {
  const getter = get(optic)

  const newAtom$ = atom$.pipe(map(getter), distinctUntilChanged(equal))
  const newNext = (nextA: A) => {
    next(set(optic)(nextA)(getValue()))
  }
  const newValue = () => get(optic)(getValue())

  return atomConstructor(newAtom$, newNext, newValue)
}

const constructUpdater = <A>(next: (value: A) => void, getValue: () => A) => (
  updater: A | ((oldValue: A) => A),
): void => {
  const newValue = updater instanceof Function ? updater(getValue()) : updater
  next(newValue)
}
