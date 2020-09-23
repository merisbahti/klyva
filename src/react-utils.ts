import React from 'react'
import { useMemo } from 'react'
import { atom } from './atom'
import { DerivedAtomReader, ReadOnlyAtom, Atom } from './types'

export function useNewAtom<S>(value: DerivedAtomReader<S>): ReadOnlyAtom<S>
export function useNewAtom<S>(value: S): Atom<S>
export function useNewAtom<S>(value: S | DerivedAtomReader<S>) {
  const noDeps = [] as never[]
  // We want it to behave like useState, where if the argument is updated, nothing changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => atom(value), noDeps)
}

export const useAtom = <T>(atom: Atom<T>) => {
  const [, setCache] = React.useState({})
  React.useEffect(() => {
    const unsub = atom.subscribe(() => {
      setCache({})
    })
    return unsub
  }, [atom])
  return atom.getValue()
}

/*
export const useFocus = <T>(
  atom: Atom<T>,
  focus: Parameters<typeof atom.focus>[0],
) => {
  return React.useMemo(() => atom.focus(focus), [])
}
*/
