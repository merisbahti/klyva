import { useSelector } from './use-selector'
import { atom } from '../atom-constructors'
import { equalNumberArray, getAtomAtIndex } from '../inner-utils'
import { Atom, RemovableAtom } from '../types'
import { getAtomName } from '../atom-utils/meta'

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
  }, `${getAtomName(arrayAtom)}_keptIndexes`)

  const keptIndexes = useSelector(keptIndexesAtom, v => v, equalNumberArray)

  return keptIndexes.map(index => getAtomAtIndex(arrayAtom, index))
}
