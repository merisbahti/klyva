import React from 'react'
import { useState } from 'react'
import { atom } from './atom'
import sliceAtomArray from './slice-atom-array'
import {
  DerivedAtomReader,
  PrimitiveAtom,
  PrimitiveRemovableAtom,
  ReadableAtom,
} from './types'

export function useNewAtom<S>(value: DerivedAtomReader<S>): ReadableAtom<S>
export function useNewAtom<S>(value: S): PrimitiveAtom<S>
export function useNewAtom<S>(value: S | DerivedAtomReader<S>) {
  return useState(() => atom(value))[0]
}

export const useAtom = <T>(atom: ReadableAtom<T>): T => {
  const [cache, setCache] = React.useState(atom.getValue())
  React.useEffect(() => {
    const unsub = atom.subscribe(value => {
      setCache(value)
    })
    return unsub
  }, [atom])
  return cache
}

export const useAtomSlice = <T>(
  arrayAtom: PrimitiveAtom<Array<T>>,
): Array<PrimitiveRemovableAtom<T>> => {
  const atomArray = React.useMemo(() => sliceAtomArray(arrayAtom), [arrayAtom])
  return useAtom(atomArray)
}
