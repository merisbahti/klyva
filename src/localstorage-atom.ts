import { atom } from './atom'
import { SetState } from './types'

const localStorageAtom = <T>(
  initialValue: T,
  key: string,
  verifyItem: (storedValue: unknown) => storedValue is T = (v): v is T =>
    Boolean(v ?? true),
) => {
  const storedItem = localStorage.getItem(key)
  const parsedItem = storedItem !== null ? JSON.parse(storedItem) : null
  const initialItem =
    parsedItem !== null && verifyItem(parsedItem) ? parsedItem : initialValue

  const baseAtom = atom(initialItem)
  const derivedAtom = atom(
    get => get(baseAtom),
    (producer: SetState<T>) => {
      const newValue =
        producer instanceof Function ? producer(baseAtom.getValue()) : producer
      baseAtom.update(newValue)
      localStorage.setItem(key, JSON.stringify(newValue))
    },
  )
  return derivedAtom
}

export default localStorageAtom
