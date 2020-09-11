import { Lens, get, set } from 'optics-ts'
import { BehaviorSubject } from 'rxjs'
import { tap, map, distinctUntilChanged } from 'rxjs/operators'
import convertObservableToBehaviorSubject from './convert-observable-to-behavior-subject'
import equal from 'deep-equal'

export type Atom<S> = {
  subscribe: (listener: (value: S) => void) => void
  // TODO: add prisms/traversals
  focus: <A>(optic: Lens<S, any, A>) => Atom<A>
  update: (updater: S | ((oldValue: S) => S)) => void
}

export const atom = <S>(value: S): Atom<S> => {
  const atom$ = new BehaviorSubject<S>(value)
  let latestValue = value

  atom$.pipe(
    tap(next => {
      latestValue = next
    }),
  )

  return {
    subscribe: listener => {
      atom$.subscribe(next => listener(next))
    },
    focus: <A>(optic: Lens<S, any, A>): Atom<A> => {
      const getter = get(optic)
      const latestAValue = getter(latestValue)
      const parentObserver = atom$.pipe(
        map(getter),
        distinctUntilChanged(equal),
      )
      const newSub = convertObservableToBehaviorSubject(
        parentObserver,
        latestAValue,
      )
      newSub.subscribe(next => {
        atom$.next(set(optic)(next)(latestValue))
      })
      return derivedAtom(newSub, getter(latestValue))
    },
    update: updater => {
      const newValue =
        updater instanceof Function ? updater(latestValue) : updater
      atom$.next(newValue)
    },
  }
}

export const derivedAtom = <T>(
  subject: BehaviorSubject<T>,
  initialLatestValue: T,
): Atom<T> => {
  let latestValue = initialLatestValue

  subject.pipe(
    tap(next => {
      latestValue = next
    }),
  )

  return {
    subscribe: listener => {
      subject.subscribe(next => listener(next))
    },
    focus: <NewSub>(_newOptic: Lens<T, any, NewSub>): Atom<NewSub> => {
      throw new Error('focus on derived atoms not implemented')
    },
    update: updater => {
      const newValue =
        updater instanceof Function ? updater(latestValue) : updater
      subject.next(newValue)
    },
  }
}
