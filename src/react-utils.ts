import equal from 'fast-deep-equal'
import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { atom } from './atom'
import { sliceAtomArray } from './slice-atom-array'
import {
  Atom,
  PrimitiveAtom,
  PrimitiveRemovableAtom,
  ReadableAtom,
} from './types'

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
