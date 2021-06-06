import { atom } from './atom'
import { Atom, RemovableAtom, Updater } from './types'

const getAtomOfValueAtKey = <O extends object, K extends keyof O>(
  atomOfObject: Atom<O>,
  key: K,
) => {
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

export const sliceAtomObject = <O extends object>(
  atomOfObject: Atom<O>,
): { [x in keyof O]: RemovableAtom<O[x]> } => {
  const keys = Object.keys(atomOfObject.getValue()) as (keyof O)[]
  return keys.reduce((memo, key) => {
    memo[key] = getAtomOfValueAtKey(atomOfObject, key)
    return memo
  }, ({} as unknown) as { [x in keyof O]: RemovableAtom<O[x]> })
}
