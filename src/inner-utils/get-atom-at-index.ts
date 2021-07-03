import { atom } from '../atom-constructors'
import { Atom, RemovableAtom, Updater } from '../types'

export const getAtomAtIndex = <Value>(
  atomOfArray: Atom<Array<Value>>,
  index: number,
): RemovableAtom<Value> => {
  let cachedValue: Value
  const sliceIsRemoved = (index: number) =>
    index >= atomOfArray.getValue().length
  const newAtom = atom(
    get => {
      /** This conceptually signals that the slice at
       * the index has "completed", and it should not update,
       * nor return anything other than its cached value.
       */
      const newValue = get(atomOfArray)[index]
      if (sliceIsRemoved(index)) {
        return cachedValue
      }
      cachedValue = newValue
      return cachedValue
    },
    (update: Updater<Value>) => {
      if (!sliceIsRemoved(index)) {
        const oldValue = atomOfArray.getValue()[index]
        const newValue = update instanceof Function ? update(oldValue) : update
        atomOfArray.update(oldArr => [
          ...oldArr.slice(0, index),
          newValue,
          ...oldArr.slice(index + 1),
        ])
      }
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
