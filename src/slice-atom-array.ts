import { optic, remove } from 'optics-ts'
import { atom } from './atom'
import focusAtom from './focus-atom'
import { PrimitiveAtom, PrimitiveRemovableAtom, ReadableAtom } from './types'

const sliceAtomArray = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
): ReadableAtom<Array<PrimitiveRemovableAtom<Value>>> => {
  const getAtomAtIndex = (index: number) => {
    const newAtom = focusAtom(atomOfArray, optic =>
      optic.index(index),
    ) as PrimitiveAtom<Value>
    return {
      ...newAtom,
      remove: () => {
        atomOfArray.update(remove(optic<Array<Value>>().index(index)))
      },
    }
  }
  const getArrayAtLength = (length: number) => {
    const emptyArray = Array.from(new Array(length))
    const newValue = emptyArray.map((_, index) => getAtomAtIndex(index))
    return newValue
  }
  const atomLengthAtom = atom(atomGetter => {
    return atomGetter(atomOfArray).length
  })
  return atom(atomGetter => {
    const length = atomGetter(atomLengthAtom)
    return getArrayAtLength(length)
  })
}

export default sliceAtomArray
