import React from 'react'
import { useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { atom } from './atom'
import equal from './equal'
import {
  Atom,
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

export function useAtom<Value, Updater>(
  atom: Atom<Value, Updater>,
): [Value, (updater: Updater) => void]
// eslint-disable-next-line no-redeclare
export function useAtom<Value>(atom: ReadableAtom<Value>): [Value]
// eslint-disable-next-line no-redeclare
export function useAtom<Value, Updater = unknown>(
  atom: ReadableAtom<Value> & { update?: (updater: Updater) => void },
) {
  const [cache, setCache] = React.useState(() => atom.getValue())
  React.useEffect(() => {
    setCache((oldCache: any) => {
      const currValue = atom.getValue()
      if (equal(currValue, oldCache)) {
        return oldCache
      }
      return currValue
    })
    const unsub = atom.subscribe(value => setCache(value))
    return () => unsub()
  }, [atom])
  const updaterMaybe: null | ((updater: Updater) => void) = React.useMemo(
    () =>
      atom.update
        ? updater => {
            unstable_batchedUpdates(() => {
              atom.update?.(updater)
            })
          }
        : null,
    [atom],
  )
  return [cache, ...(updaterMaybe ? [updaterMaybe] : [])]
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
  return useAtom(selectorAtom)[0]
}

export const useAtomSlice = <T>(
  arrayAtom: PrimitiveAtom<Array<T>>,
  filterBy?: (value: T) => boolean,
): Array<PrimitiveRemovableAtom<T>> => {
  const keptIndexesAtom = atom(get =>
    filterBy
      ? get(arrayAtom).flatMap((value, index) => {
          return filterBy(value) ? [index] : []
        })
      : get(arrayAtom).map((_, index) => index),
  )

  const keptIndexes = useSelector(keptIndexesAtom)

  const sliced = sliceAtomArray(arrayAtom)

  return keptIndexes
    ? sliced.filter((_, index) => keptIndexes.includes(index))
    : sliced
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
