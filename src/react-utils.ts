import React from 'react'
import { useState } from 'react'
import { atom } from './atom'
import equal from './equal'
import {
  DerivedAtomReader,
  PrimitiveAtom,
  PrimitiveRemovableAtom,
  ReadableAtom,
  SetState,
} from './types'

export function useNewAtom<S>(value: DerivedAtomReader<S>): ReadableAtom<S>
// REMOVE WHEN NEW VERISON OF TSDX IS RELEASED
// eslint-disable-next-line no-redeclare
export function useNewAtom<S>(value: S): PrimitiveAtom<S>
// REMOVE WHEN NEW VERISON OF TSDX IS RELEASED
// eslint-disable-next-line no-redeclare
export function useNewAtom<S>(value: S | DerivedAtomReader<S>) {
  return useState(() => atom(value))[0]
}

export const useAtom = <T>(atom: ReadableAtom<T>): T => {
  const [cache, setCache] = React.useState(atom.getValue())
  React.useEffect(() => {
    setCache(oldCache => {
      const currValue = atom.getValue()
      if (equal(currValue, oldCache)) {
        return oldCache
      }
      return currValue
    })
    const unsub = atom.subscribe(value => setCache(value))
    return () => unsub()
  }, [atom])
  return cache
}

export const useSelector = <S, A>(
  sourceAtom: ReadableAtom<S>,
  selector: (source: S) => A,
): A => {
  const selectorAtom = React.useMemo(
    () => atom(get => selector(get(sourceAtom))),
    [selector, sourceAtom],
  )
  return useAtom(selectorAtom)
}

export const useAtomSlice = <T>(
  arrayAtom: PrimitiveAtom<Array<T>>,
): Array<PrimitiveRemovableAtom<T>> => {
  useSelector(arrayAtom, arr => arr.length)
  return sliceAtomArray(arrayAtom)
}

export const sliceAtomArray = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
): Array<PrimitiveRemovableAtom<Value>> => {
  const sliceIsRemoved = (index: number) =>
    index >= atomOfArray.getValue().length

  const getAtomAtIndex = (index: number) => {
    let cachedValue: Value
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
      (update: SetState<Value>) => {
        if (!sliceIsRemoved(index)) {
          const oldValue = atomOfArray.getValue()[index]
          const newValue =
            update instanceof Function ? update(oldValue) : update
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
  const getArrayAtLength = (length: number) => {
    const emptyArray = Array.from(new Array(length))
    const newValue = emptyArray.map((_, index) => getAtomAtIndex(index))
    return newValue
  }
  const length = atomOfArray.getValue().length
  return getArrayAtLength(length)
}
