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
  get: () => S
}

export type ReadOnlyAtom<S> = Omit<Atom<S>, 'update'>

export const atom = <S>(value: S): Atom<S> => {
  const atom$ = new BehaviorSubject<S>(value)
  return {
    subscribe: listener => atom$.subscribe(value => listener(value)),
    focus: <A>(
      optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
    ) => {
      const newAtom$ = atom$.pipe(map(get(optic)), distinctUntilChanged(equal))
      const newNext = (nextA: A) => {
        atom$.next(set(optic)(nextA)(atom$.value))
      }
      const newValue = () => get(optic)(atom$.value)

      return derivedAtom(newAtom$, newNext, newValue)
    },
    update: updater => {
      const newValue =
        updater instanceof Function ? updater(atom$.value) : updater
      atom$.next(newValue)
    },
    get: () => atom$.value,
  }
}

const derivedAtom = <S>(
  atom$: Observable<S>,
  next: (next: S) => void,
  value: () => S,
): Atom<S> => {
  return {
    subscribe: listener => atom$.subscribe(value => listener(value)),
    focus: <A>(
      optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
    ) => {
      const getter = get(optic)

      const newAtom$ = atom$.pipe(map(getter), distinctUntilChanged(equal))
      const newNext = (nextA: A) => {
        next(set(optic)(nextA)(value()))
      }
      const newValue = () => get(optic)(value())

      return derivedAtom(newAtom$, newNext, newValue)
    },
    update: updater => {
      const newValue = updater instanceof Function ? updater(value()) : updater
      next(newValue)
    },
    get: value,
  }
}
