import { atom } from './atom'
import focusAtom from './focus-atom'
import { PrimitiveAtom, ReadableAtom } from './types'

const sliceAtomArray = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
): ReadableAtom<Array<PrimitiveAtom<Value>>> => {
  const cache: Record<number, PrimitiveAtom<Value>> = {}
  const arrayCache: Record<number, Array<PrimitiveAtom<Value>>> = {}
  const getAtomAtIndex = (index: number) => {
    if (!cache[index]) {
      const newValue = focusAtom(atomOfArray, optic => optic.index(index))
      // Kindly coercing this to a PrimitiveAtom
      const coerced = newValue as PrimitiveAtom<Value>
      cache[index] = coerced
    }
    return cache[index]
  }
  const getArrayAtLength = (length: number) => {
    if (!arrayCache[length]) {
      const emptyArray = Array.from(new Array(length))
      const newValue = emptyArray.map((_, index) => getAtomAtIndex(index))

      arrayCache[length] = newValue
    }
    return arrayCache[length]
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
