import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test('two sibling atoms wont be updated when the other one is', () => {
  const value = { a: 0, b: 10 }
  const baseAtom = atom(value)
  const atomA = focusAtom(baseAtom, optic => optic.prop('a'))
  const atomB = focusAtom(baseAtom, optic => optic.prop('b'))

  let baseAtomUpdates = 0
  let atomAUpdates = 0
  let atomBUpdates = 0

  baseAtom.subscribe(next => {
    baseAtomUpdates += 1
    console.log('baseAtom updated', next, baseAtomUpdates)
  })
  atomA.subscribe(next => {
    atomAUpdates += 1
    console.log('atomA updated', next, atomAUpdates)
  })
  atomB.subscribe(next => {
    atomBUpdates += 1
    console.log('atomB updated', next, atomBUpdates)
  })

  expect(baseAtomUpdates).toBe(1)
  expect(atomAUpdates).toBe(1)
  expect(atomBUpdates).toBe(1)

  console.log('Updating A')
  atomA.update(1)
  expect(baseAtomUpdates).toBe(2)
  expect(atomAUpdates).toBe(2)
  expect(atomBUpdates).toBe(1)

  console.log('Updating B')
  atomB.update(11)
  expect(baseAtomUpdates).toBe(3)
  expect(atomAUpdates).toBe(2)
  expect(atomBUpdates).toBe(2)
})
