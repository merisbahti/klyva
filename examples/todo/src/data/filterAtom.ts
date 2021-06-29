import { atom } from 'klyva'
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
  // Get initial filter from current window hash
  const filterAtom = atom<Filter>(readFilterFromHash())
  // Update filter whenever hash changes
  window.addEventListener('hashchange', () => {
    const newHash = readFilterFromHash()
    if (newHash !== filterAtom.getValue()) {
      filterAtom.update(readFilterFromHash())
    }
  })
  // Update hash whenever filter changes
  filterAtom.subscribe(val => {
    const currentHash = readFilterFromHash()
    if (val !== currentHash) {
      window.location.hash = `/${val}`
    }
  })
  return filterAtom
}
