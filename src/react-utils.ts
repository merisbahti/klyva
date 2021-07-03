import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { atom } from './atom'
import { Atom, CustomAtom, ReadableAtom, RemovableAtom, Updater } from './'
import {
  equal,
  identity,
  equalNumberArray,
  getAtomAtIndex,
} from './inner-utils'

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

export const useCreateAtom = <Value>(makeInitialValue: () => Value) => {
  const [createdAtom] = React.useState<Atom<Value>>(() =>
    atom(makeInitialValue()),
  )
  return createdAtom
}
