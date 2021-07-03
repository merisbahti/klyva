import fastDeepEqual from 'fast-deep-equal'
import { atom } from './atom-constructors'
import { Atom, RemovableAtom, Updater } from './types'

/*
These are implementation detail utilities, not meant to be exported from the Klyva package.
*/

export const equal = (l1: any, l2: any) => {
  return fastDeepEqual(l1, l2)
}

export const identity = (id: any) => id

export const equalNumberArray = (l: number[], r: number[]) =>
  l.length === r.length && !l.some((lVal, lIndex) => lVal !== r[lIndex])

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
