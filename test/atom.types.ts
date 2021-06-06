// This file ensures that we get correctly typed return value from atom creator

import { Atom, CustomAtom, ReadableAtom, Updater } from '../src'
import { atom } from '../src/atom'

// When just passing in a value we get a regular Atom
const a1: Atom<number> = atom(7)

// If we pass in a getter we get a Readable atom of the type we apply that getter to
const a2: ReadableAtom<number> = atom(get => get(a1))

// If we also pass a write function we get a CustomAtom instead
const a3: CustomAtom<number, Updater<number>> = atom(
  get => get(a2),
  () => {},
)

console.log('just to use all variables', a1, a2, a3)
