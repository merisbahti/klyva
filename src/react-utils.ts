import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { atom } from './atom'
import {
  Atom,
  PrimitiveAtom,
  PrimitiveRemovableAtom,
  ReadableAtom,
  SetState,
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
    setCache(atom.getValue())
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
  <S, A>(
    sourceAtom: ReadableAtom<S>,
    selector: (source: S) => A,
    equals?: (left: S, right: S) => boolean,
  ): A
  <S>(sourceAtom: ReadableAtom<S>): S
}

const identity = (id: any) => id
export const useSelector: UseSelector = (
  sourceAtom: any,
  selector: any = identity,
  equals = Object.is,
) => {
  const latestValueRef = React.useRef<any>()
  const selectorAtom = atom(get => {
    const newSlice = selector(get(sourceAtom))
    if (
      latestValueRef.current === undefined ||
      !equals(newSlice, latestValueRef.current)
    ) {
      latestValueRef.current = newSlice
    }
    return latestValueRef.current
  })

  return useAtom(selectorAtom)[0]
}

const equalNumberArray = (l: number[], r: number[]) =>
  l.length === r.length && !l.some((lVal, lIndex) => lVal !== r[lIndex])
export const useAtomSlice = <T>(
  arrayAtom: PrimitiveAtom<Array<T>>,
  filterBy?: (value: T) => boolean,
): Array<PrimitiveRemovableAtom<T>> => {
  const keptIndexesAtom = atom(get => {
    return filterBy
      ? get(arrayAtom).flatMap((value, index) => {
          return filterBy(value) ? [index] : []
        })
      : get(arrayAtom).map((_, index) => index)
  })

  const atomsCache = React.useRef<Record<number, PrimitiveRemovableAtom<T>>>({})

  const getAtomFromCache = (index: number) => {
    const cachedValue = atomsCache.current[index]
    if (!cachedValue) {
      atomsCache.current[index] = getAtomAtIndex(arrayAtom, index)
    }
    return atomsCache.current[index]
  }

  const keptIndexes = useSelector(keptIndexesAtom, v => v, equalNumberArray)

  return keptIndexes.map(getAtomFromCache)
}

const getAtomAtIndex = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
  index: number,
) => {
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
    (update: SetState<Value>) => {
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

export const sliceAtomArray = <Value>(
  atomOfArray: PrimitiveAtom<Array<Value>>,
): Array<PrimitiveRemovableAtom<Value>> => {
  const getArrayAtLength = (length: number) => {
    const emptyArray = Array.from(new Array(length))
    const newValue = emptyArray.map((_, index) =>
      getAtomAtIndex(atomOfArray, index),
    )
    return newValue
  }
  const length = atomOfArray.getValue().length
  return getArrayAtLength(length)
}
