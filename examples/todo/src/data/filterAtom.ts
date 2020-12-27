import { atom } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'
import { Filter } from '../../types'

// Small helper to map the current hash to a valid filter, falling back to 'all' as default
export const readFilterFromHash = () => {
  const hash = window.location.hash
  return hash === '#/active'
    ? 'active'
    : hash === '#/completed'
    ? 'completed'
    : 'all'
}

// Create the atom to be used in the TodoMVC app
export const makeFilterAtom = () => {
  const filterAtom = atom<Filter>('all')
  syncFilterAtomWithHash(filterAtom)
  return filterAtom
}

export const syncFilterAtomWithHash = (filterAtom: PrimitiveAtom<Filter>) => {
  const currentHash = readFilterFromHash()
  // Get initial filter from current window hash
  if (filterAtom.getValue() !== currentHash) {
    filterAtom.update(currentHash)
  }
  // Update filter whenever hash chances
  window.addEventListener('hashchange', () => {
    filterAtom.update(readFilterFromHash())
  })
}
