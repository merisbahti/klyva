import { Lens, Equivalence, Iso, Getter } from 'optics-ts'

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

export type AtomGetter = <Value>(atom: Atom<Value>) => Value
export type DerivedAtomReader<S> = (read: AtomGetter) => S

export type RwFocus<S> = {
  <A>(optic: Getter<S, A>): ReadOnlyAtom<S>
  <A>(optic: Lens<S, any, A> | Equivalence<S, any, A> | Iso<S, any, A>): Atom<S>
}
