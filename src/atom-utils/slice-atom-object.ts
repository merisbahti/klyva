import { getAtomAtKey } from '../inner-utils'
import { Atom, RemovableAtom } from '../types'

export const sliceAtomObject = <O extends object>(
  atomOfObject: Atom<O>,
): { [x in keyof O]: RemovableAtom<O[x]> } => {
  const keys = Object.keys(atomOfObject.getValue()) as (keyof O)[]
  return keys.reduce((memo, key) => {
    memo[key] = getAtomAtKey(atomOfObject, key)
    return memo
  }, {} as unknown as { [x in keyof O]: RemovableAtom<O[x]> })
}
