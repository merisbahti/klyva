import { atom } from '../src/atom'

test('getter optics work as expected', () => {
  const atomA = atom(10)
  const atomB = atom(5)
  const atomC = atom('then')
  const derived = atom(get => (get(atomA) < get(atomB) ? get(atomC) : false))

  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomA.update(0)
  expect(atomA.getValue()).toBe(0)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe('then')

  atomB.update(20)
  expect(atomA.getValue()).toBe(0)
  expect(atomB.getValue()).toBe(20)
  expect(derived.getValue()).toBe('then')
})
