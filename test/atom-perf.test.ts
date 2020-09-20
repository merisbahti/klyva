import { atom } from '../src/atom'

test('two sibling atoms wont be updated when the other one is', () => {
  const value = { a: 0, b: 10 }
  const baseAtom = atom(value)
  const atomA = baseAtom.focus(optic => optic.prop('a'))
  const atomB = baseAtom.focus(optic => optic.prop('b'))

  let baseAtomUpdates = 0
  let atomAUpdates = 0
  let atomBUpdates = 0

  baseAtom.subscribe(() => {
    baseAtomUpdates += 1
  })
  atomA.subscribe(() => {
    atomAUpdates += 1
  })
  atomB.subscribe(() => {
    atomBUpdates += 1
  })

  expect(baseAtomUpdates).toBe(1)
  expect(atomAUpdates).toBe(1)
  expect(atomBUpdates).toBe(1)

  atomA.update(val => val + 1)
  expect(baseAtomUpdates).toBe(2)
  expect(atomAUpdates).toBe(2)
  expect(atomBUpdates).toBe(1)

  atomB.update(val => val + 1)
  expect(baseAtomUpdates).toBe(3)
  expect(atomAUpdates).toBe(2)
  expect(atomBUpdates).toBe(2)
})
