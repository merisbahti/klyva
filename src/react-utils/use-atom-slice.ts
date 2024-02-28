import { atom } from '../atom-constructors'
import { getAtomAtIndex } from '../inner-utils'
import { Atom, RemovableAtom } from '../types'
import { useAtom } from './use-atom'

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

  const [keptIndexes] = useAtom(keptIndexesAtom)

  return keptIndexes.map(index => getAtomAtIndex(arrayAtom, index))
}
