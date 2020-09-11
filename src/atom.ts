import { Lens, get, set } from 'optics-ts'
import { BehaviorSubject } from 'rxjs'
import { map, distinctUntilChanged } from 'rxjs/operators'
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
    subscribe: listener => atom$.subscribe(value => listener(value)),
    focus: optic => {
      const getter = get(optic)
      const latestAValue = getter(atom$.value)

      const newSub = new BehaviorSubject(latestAValue)

      newSub.pipe(distinctUntilChanged(equal)).subscribe(next => {
        atom$.next(set(optic)(next)(atom$.value))
      })

      atom$
        .pipe(map(getter), distinctUntilChanged(equal))
        .subscribe(next => newSub.next(next))

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
