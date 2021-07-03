import { atom } from '.'
import { Atom, Updater } from '..'

type Verifier<T> = (v: unknown) => v is T

const getInitialItem = <T>(
  defaultValue: T,
  key: string,
  verifier?: Verifier<T>,
) => {
  const storedItem = localStorage.getItem(key)
  if (storedItem === null) {
    return defaultValue
  }
  try {
    const parsedItem = JSON.parse(storedItem)
    if (!verifier || verifier(parsedItem)) {
      return parsedItem
    }
  } catch (err) {}
  return defaultValue
}

export const localStorageAtom = <T>(
  initialValue: T,
  key: string,
  verifyItem?: Verifier<T>,
): Atom<T> => {
  const initialItem = getInitialItem(initialValue, key, verifyItem)

  const baseAtom = atom(initialItem)
  const derivedAtom = atom(
    get => get(baseAtom),
    (producer: Updater<T>) => {
      const newValue =
        producer instanceof Function ? producer(baseAtom.getValue()) : producer
      baseAtom.update(newValue)
      localStorage.setItem(key, JSON.stringify(newValue))
    },
  )
  return derivedAtom
}
