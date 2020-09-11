import { atom } from '../src/atom'
import { optic } from 'optics-ts'

test('two sibling atoms wont be updated when the other one is', () => {
  const value = { a: 0, b: 10 }
  const baseAtom = atom(value)
  const atomA = baseAtom.focus(optic<typeof value>().prop('a'))
  const atomB = baseAtom.focus(optic<typeof value>().prop('b'))

  let baseAtomUpdates = 0
  let atomAUpdates = 0
  let atomBUpdates = 0

  baseAtom.subscribe(baseValue => {
    console.log('baseAtom', baseValue)
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
  // Why is this one updated twice?
  expect(atomAUpdates).toBe(3)
  expect(atomBUpdates).toBe(1)

  atomB.update(val => val + 1)
  expect(baseAtomUpdates).toBe(3)
  expect(atomAUpdates).toBe(3)
  // Why is this one updated twice?
  expect(atomBUpdates).toBe(3)
})
