import { atom, resetAll } from '../src'

it('works to reset all atoms (without subscriptions)', () => {
  const baseAtom = atom(0)
  const derivedAtom = atom(get => get(baseAtom) + 1)

  expect(baseAtom.getValue()).toBe(0)
  expect(derivedAtom.getValue()).toBe(1)

  baseAtom.update(value => value + 1)

  expect(baseAtom.getValue()).toBe(1)
  expect(derivedAtom.getValue()).toBe(2)

  resetAll()

  expect(baseAtom.getValue()).toBe(0)
  expect(derivedAtom.getValue()).toBe(1)
})

it('works to reset all atoms (with subscriptions)', () => {
  const baseAtom = atom(0)

  let latestBaseAtomValue = baseAtom.getValue()

  baseAtom.subscribe(value => (latestBaseAtomValue = value))

  expect(latestBaseAtomValue).toBe(0)

  baseAtom.update(value => value + 1)

  expect(latestBaseAtomValue).toBe(1)

  resetAll()

  expect(latestBaseAtomValue).toBe(0)
})
