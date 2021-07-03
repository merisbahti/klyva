import { atom, focusAtom } from '../src'

test('two sibling atoms wont be updated when the other one is', () => {
  const value = { a: 0, b: 10 }
  const baseAtom = atom(value)
  const atomA = focusAtom(baseAtom, optic => optic.prop('a'))
  const atomB = focusAtom(baseAtom, optic => optic.prop('b'))

  let baseAtomUpdates = 0
  let atomAUpdates = 0
  let atomBUpdates = 0
  let latestBaseAtomValue = baseAtom.getValue()
  let latestAtomAValue = atomA.getValue()
  let latestAtomBValue = atomB.getValue()

  baseAtom.subscribe(value => {
    latestBaseAtomValue = value
    baseAtomUpdates += 1
  })
  atomA.subscribe(value => {
    latestAtomAValue = value
    atomAUpdates += 1
  })
  atomB.subscribe(value => {
    latestAtomBValue = value
    atomBUpdates += 1
  })

  expect(latestBaseAtomValue).toEqual({ a: 0, b: 10 })
  expect(latestAtomAValue).toBe(0)
  expect(latestAtomBValue).toBe(10)
  expect(baseAtomUpdates).toBe(0)
  expect(atomAUpdates).toBe(0)
  expect(atomBUpdates).toBe(0)

  atomB.update(1)
  expect(latestBaseAtomValue).toEqual({ a: 0, b: 1 })
  expect(latestAtomAValue).toBe(0)
  expect(latestAtomBValue).toBe(1)
  expect(baseAtomUpdates).toBe(1)
  expect(atomAUpdates).toBe(0)
  expect(atomBUpdates).toBe(1)

  atomA.update(11)
  expect(latestBaseAtomValue).toEqual({ a: 11, b: 1 })
  expect(latestAtomAValue).toBe(11)
  expect(latestAtomBValue).toBe(1)
  expect(baseAtomUpdates).toBe(2)
  expect(atomAUpdates).toBe(1)
  expect(atomBUpdates).toBe(1)
})
