import { Atom, atom } from '../../../src'

const createIsSelectedAtom = (
  selectedIndexAtom: Atom<null | number>,
  index: number,
) =>
  atom(
    get => get(selectedIndexAtom) === index,
    updater => {
      selectedIndexAtom.update(selectedIndex => {
        const currentValue = selectedIndex === index
        const newValue =
          typeof updater === 'function' ? updater(currentValue) : updater
        if (newValue) {
          return index
        } else {
          return null
        }
      })
    },
  )
export default createIsSelectedAtom
