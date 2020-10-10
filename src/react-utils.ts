import React from 'react'
import { useState } from 'react'
import { atom } from './atom'
import { DerivedAtomReader, ReadOnlyAtom, Atom } from './types'

export function useNewAtom<S>(value: DerivedAtomReader<S>): ReadOnlyAtom<S>
export function useNewAtom<S>(value: S): Atom<S>
export function useNewAtom<S>(value: S | DerivedAtomReader<S>) {
  return useState(() => atom(value))[0]
}

export const useAtom = <T>(atom: ReadOnlyAtom<T>) => {
  const [cache, setCache] = React.useState(atom.getValue())
  React.useEffect(() => {
    const unsub = atom.subscribe(value => {
      setCache(value)
    })
    return unsub
  }, [atom])
  return cache
}

/*
export const useFocus = <T>(
  atom: Atom<T>,
  focus: Parameters<typeof atom.focus>[0],
) => {
  return React.useMemo(() => atom.focus(focus), [])
}
*/
