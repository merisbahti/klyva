import { getAtomAtIndex } from './inner-utils'
import { Atom, RemovableAtom } from './types'

export const sliceAtomArray = <Value>(
  atomOfArray: Atom<Array<Value>>,
): Array<RemovableAtom<Value>> => {
  const getArrayAtLength = (length: number) => {
    const emptyArray = Array.from(new Array(length))
    const newValue = emptyArray.map((_, index) =>
      getAtomAtIndex(atomOfArray, index),
    )
    return newValue
  }
  const length = atomOfArray.getValue().length
  return getArrayAtLength(length)
}
