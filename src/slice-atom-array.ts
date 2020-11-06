import { optic, remove } from 'optics-ts'
import { atom } from './atom'
import focusAtom from './focus-atom'
import { PrimitiveAtom, PrimitiveRemovableAtom, ReadableAtom } from './types'

const sliceAtomArray = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
): ReadableAtom<Array<PrimitiveRemovableAtom<Value>>> => {
  const cache: Record<number, PrimitiveRemovableAtom<Value>> = {}
  const arrayCache: Record<number, Array<PrimitiveRemovableAtom<Value>>> = {}
  const getAtomAtIndex = (index: number) => {
    if (!cache[index]) {
      const newValue = focusAtom(atomOfArray, optic => optic.index(index))
      // Kindly coercing this to a PrimitiveAtom
      const coerced = newValue as PrimitiveAtom<Value>
      cache[index] = {
        ...coerced,
        remove: () => {
          console.log('removing')
          atomOfArray.update(remove(optic<Array<Value>>().index(index)))
        },
      }
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
