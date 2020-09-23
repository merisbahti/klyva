import { Lens, Equivalence, Iso, Getter } from 'optics-ts'

export type Atom<S> = {
  subscribe: (listener: (value: S) => void) => () => void

  focus<A>(
    callback: (optic: Equivalence<S, any, S>) => Getter<S, A>,
  ): ReadOnlyAtom<A>
  focus<A>(
    callback: (
      optic: Equivalence<S, any, S>,
    ) => Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
  ): Atom<A>

  update: (updater: S | ((oldValue: S) => S)) => void
  getValue: () => S
}

export type ReadOnlyAtom<S> = {
  subscribe: (listener: (value: S) => void) => () => void
  focus<A>(
    callback: (optic: Equivalence<S, any, S>) => Getter<S, A>,
  ): ReadOnlyAtom<A>
  getValue: () => S
}

export type AtomGetter = <Value>(atom: Atom<Value>) => Value
export type DerivedAtomReader<S> = (read: AtomGetter) => S

export type RwFocus<S> = {
  <A>(callback: (optic: Equivalence<S, any, S>) => Getter<S, A>): ReadOnlyAtom<
    A
  >
  <A>(
    callback: (
      optic: Equivalence<S, any, S>,
    ) => Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>,
  ): Atom<A>
}
