import { atom } from '.'
import { PrimitiveAtom, PrimitiveRemovableAtom, SetState } from './types'

const sliceAtomArray = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
): Array<PrimitiveRemovableAtom<Value>> => {
  const getAtomAtIndex = (index: number) => {
    const newAtom = atom(
      get => {
        return get(atomOfArray)[index]
      },
      (update: SetState<Value>) => {
        const oldValue = atomOfArray.getValue()[index]
        const newValue = update instanceof Function ? update(oldValue) : update
        atomOfArray.update(oldArr => [
          ...oldArr.slice(0, index),
          newValue,
          ...oldArr.slice(index + 1),
        ])
      },
    )
    return {
      ...newAtom,
      remove: () => {
        atomOfArray.update(oldArr => [
          ...oldArr.slice(0, index),
          ...oldArr.slice(index + 1),
        ])
      },
    }
  }
  const getArrayAtLength = (length: number) => {
    const emptyArray = Array.from(new Array(length))
    const newValue = emptyArray.map((_, index) => getAtomAtIndex(index))
    return newValue
  }
  const length = atomOfArray.getValue().length
  return getArrayAtLength(length)
}

export default sliceAtomArray
