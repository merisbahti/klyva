import React, { useRef } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { atom } from './atom'
import {
  Atom,
  CustomAtom,
  PrismAtom,
  ReadableAtom,
  RemovableAtom,
  Updater,
} from './'
import equal from './equal'

export function useAtom<Value>(
  atom: Atom<Value>,
): [Value, (updater: Updater<Value>) => void]
export function useAtom<Value, Updater>(
  atom: CustomAtom<Value, Updater>,
): [Value, (updater: Updater) => void]
export function useAtom<Value>(atom: ReadableAtom<Value>): [Value]
export function useAtom<Value, Updater = unknown>(
  atom: ReadableAtom<Value> & { update?: (updater: Updater) => void },
) {
  const [cache, setCache] = React.useState(atom.getValue)
  React.useEffect(() => {
    setCache(oldCache => {
      const currValue = atom.getValue()
      if (equal(currValue, oldCache)) {
        return oldCache
      }
      return currValue
    })
    const unsub = atom.subscribe(value => setCache(() => value))
    return unsub
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
export function useAtomSlice<T, S extends T>(
  arrayAtom: Atom<Array<T>>,
  filterBy?: (value: T) => value is S,
): Array<RemovableAtom<S>>
export function useAtomSlice<T>(
  arrayAtom: Atom<Array<T>>,
  filterBy?: (value: T) => boolean,
): Array<RemovableAtom<T>>
export function useAtomSlice<T>(
  arrayAtom: Atom<Array<T>>,
  filterBy?: (value: T) => boolean,
) {
  const keptIndexesAtom = atom(get => {
    return filterBy
      ? get(arrayAtom).flatMap((value, index) => {
          return filterBy(value) ? [index] : []
        })
      : get(arrayAtom).map((_, index) => index)
  })

  const keptIndexes = useSelector(keptIndexesAtom, v => v, equalNumberArray)

  return keptIndexes.map(index => getAtomAtIndex(arrayAtom, index))
}

const getAtomAtIndex = <Value>(
  atomOfArray: Atom<Array<Value>>,
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

export const sliceAtomArray = <Value>(
  atomOfArray: Atom<Array<Value>>,
): Array<RemovableAtom<Value>> => {
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

export const useDeprismify = <T>(prismAtom: PrismAtom<T>): Atom<T> | null => {
  const latestAtomValueRef = useRef<T>()
  const isDefined = useSelector(prismAtom, v => v !== undefined)
  const returnValue: Atom<T> | null = React.useMemo(
    () =>
      isDefined
        ? atom(
            get => {
              const value = get(prismAtom)
              if (value !== undefined) {
                latestAtomValueRef.current = value
                return value
              }
              if (latestAtomValueRef.current !== undefined)
                return latestAtomValueRef.current
              throw new Error('Deprismification failed')
            },
            updater => {
              prismAtom.update(currentValue => {
                if (currentValue !== undefined) {
                  const newValue =
                    updater instanceof Function
                      ? updater(currentValue)
                      : updater
                  return newValue
                }
                return currentValue
              })
            },
          )
        : null,
    [isDefined, prismAtom],
  )

  return returnValue
}
