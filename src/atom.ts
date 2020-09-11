import { Lens, get, set } from 'optics-ts'
import { BehaviorSubject } from 'rxjs'
import { map, distinctUntilChanged } from 'rxjs/operators'
import convertObservableToBehaviorSubject from './convert-observable-to-behavior-subject'
import equal from 'deep-equal'

export type Atom<S> = {
  subscribe: (listener: (value: S) => void) => void
  focus: <A>(optic: Lens<S, any, A>) => Atom<A>
  update: (updater: S | ((oldValue: S) => S)) => void
  get: () => S
}

export const atom = <S>(
  value: S,
  atom$ = new BehaviorSubject<S>(value),
): Atom<S> => {
  return {
    subscribe: listener => {
      atom$.subscribe(next => listener(next))
    },
    focus: <A>(optic: Lens<S, any, A>): Atom<A> => {
      const getter = get(optic)
      const latestAValue = getter(atom$.value)
      const parentObserver = atom$.pipe(
        map(getter),
        distinctUntilChanged(equal),
      )
      const newSub = convertObservableToBehaviorSubject(
        parentObserver,
        latestAValue,
      )
      newSub.subscribe(next => {
        atom$.next(set(optic)(next)(atom$.value))
      })
      return atom(getter(atom$.value), newSub)
    },
    update: updater => {
      const newValue =
        updater instanceof Function ? updater(atom$.value) : updater
      atom$.next(newValue)
    },
    get: () => atom$.value,
  }
}
