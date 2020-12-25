import { atom } from 'klyva'
import { Filter } from '../types'

const readFilterFromHash = () => {
  const hash = window.location.hash
  return hash === '#/active'
    ? 'active'
    : hash === '#/completed'
    ? 'completed'
    : 'all'
}

export const makeFilterAtom = () => {
  // Get initial filter from current window hash
  const filterAtom = atom<Filter>(readFilterFromHash())
  // Update filter whenever hash chances
  window.addEventListener('hashchange', () => {
    filterAtom.update(readFilterFromHash())
  })
  return filterAtom
}
