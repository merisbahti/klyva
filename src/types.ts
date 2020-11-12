export type SetState<S> = S | ((newValue: S) => S)

export type ReadableAtom<Value> = {
  subscribe: (
    listener: (value: Value) => void,
    errorListener?: (error: unknown) => void,
  ) => () => void
  getValue: () => Value
}

export type Atom<Value, Updater> = ReadableAtom<Value> & {
  update: (updater: Updater) => void
}

export type RemovableAtom<Value, Updater> = Atom<Value, Updater> & {
  remove: () => void
}

export type PrimitiveRemovableAtom<Value> = RemovableAtom<
  Value,
  SetState<Value>
>

export type PrimitiveAtom<Value> = Atom<Value, SetState<Value>>
export type PrismAtom<Value> = Atom<Value | undefined, SetState<Value>>

export type AtomGetter = <Value>(atom: ReadableAtom<Value>) => Value
export type DerivedAtomReader<S> = (read: AtomGetter) => S
