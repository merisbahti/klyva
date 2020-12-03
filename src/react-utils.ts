import React from 'react'
import { useState } from 'react'
import focusAtom from './focus-atom'
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

type UseSelector = {
  <S, A>(sourceAtom: ReadableAtom<S>, selector: (source: S) => A): A
  <S>(sourceAtom: ReadableAtom<S>): S
}

const identity = (id: any) => id
export const useSelector: UseSelector = (
  sourceAtom: any,
  selector: any = identity,
) => {
  const selectorAtom = React.useMemo(
    () => atom(get => selector(get(sourceAtom))),
    [selector, sourceAtom],
  )
  return useAtom(selectorAtom)
}

export const useAtomSlice = <T>(
  arrayAtom: PrimitiveAtom<Array<T>>,
  filterBy?: (value: T) => boolean,
): Array<PrimitiveRemovableAtom<T>> => {
  const filtered = focusAtom(arrayAtom, optic =>
    optic.indexed().filter(([, value]) => (filterBy ? filterBy(value) : true)),
  )
  useSelector(filtered, arr => arr.length)

  const sliced = sliceAtomArray(filtered).map(atom => ({
    ...focusAtom(atom, optic => optic.nth(1)),
    remove: atom.remove,
  }))

  return sliced
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
