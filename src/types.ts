import { meta } from './symbols'

export type Updater<S> = S | ((newValue: S) => S)

export type AtomMeta = {
  id: string
  name: string
}

export type ReadableAtom<Value> = {
  subscribe: (listener: (value: Value) => void) => () => void
  getValue: () => Value
  [meta]?: AtomMeta
}

export type CustomAtom<Value, Updater> = ReadableAtom<Value> & {
  update: (updater: Updater) => void
}

export type Atom<Value> = ReadableAtom<Value> & {
  update: (updater: Updater<Value>) => void
}

export type RemovableAtom<Value> = Atom<Value> & {
  remove: () => void
}

export type PrismAtom<Value> = ReadableAtom<Value | undefined> & {
  update: (updater: Updater<Value>) => void
}

export type AtomGetter = <Value>(atom: ReadableAtom<Value>) => Value
export type DerivedAtomReader<S> = (read: AtomGetter) => S
