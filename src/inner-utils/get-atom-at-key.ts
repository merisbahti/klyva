import { atom } from '../atom-constructors'
import { getAtomName } from '../atom-utils/meta'
import { Atom, RemovableAtom, Updater } from '../types'

export const getAtomAtKey = <O extends object, K extends keyof O>(
  atomOfObject: Atom<O>,
  key: K,
): RemovableAtom<O[K]> => {
  let cachedValue: O[K]
  const keyIsRemoved = (key: K) => !atomOfObject.getValue().hasOwnProperty(key)
  const newAtom = atom(
    get => {
      if (!keyIsRemoved(key)) {
        cachedValue = get(atomOfObject)[key]
      }
      return cachedValue
    },
    (update: Updater<O[K]>) => {
      if (!keyIsRemoved(key)) {
        const oldValue = atomOfObject.getValue()[key]
        const newValue = update instanceof Function ? update(oldValue) : update
        atomOfObject.update(oldObj => ({
          ...oldObj,
          [key]: newValue,
        }))
      }
    },
    `${getAtomName(atomOfObject)}_key_${key}`,
  )
  return {
    ...newAtom,
    remove: () => {
      atomOfObject.update(oldObj => {
        const updatedObj = { ...oldObj }
        delete updatedObj[key]
        return updatedObj
      })
    },
  }
}
