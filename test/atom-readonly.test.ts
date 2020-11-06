import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test('getter optics work as expected', () => {
  const value = 10
  const baseAtom = atom(value)
  const gt0Atom = focusAtom(baseAtom, optic => optic.to(value => value > 0))
  const lt5Atom = focusAtom(baseAtom, optic => optic.to(value => value < 5))

  let baseAtomUpdates = 0
  let gt0Updates = 0
  let lt5Updates = 0

  baseAtom.subscribe(() => {
    baseAtomUpdates += 1
  })
  gt0Atom.subscribe(() => {
    gt0Updates += 1
  })
  lt5Atom.subscribe(() => {
    lt5Updates += 1
  })

  expect(baseAtomUpdates).toBe(1)
  expect(gt0Updates).toBe(1)
  expect(lt5Updates).toBe(1)
  expect(gt0Atom.getValue()).toBe(true)
  expect(lt5Atom.getValue()).toBe(false)

  baseAtom.update(-1)
  expect(baseAtomUpdates).toBe(2)
  expect(gt0Updates).toBe(2)
  expect(lt5Updates).toBe(2)
  expect(gt0Atom.getValue()).toBe(false)
  expect(lt5Atom.getValue()).toBe(true)

  baseAtom.update(-1)
  expect(baseAtomUpdates).toBe(3)
  expect(gt0Updates).toBe(2)
  expect(lt5Updates).toBe(2)
  expect(gt0Atom.getValue()).toBe(false)
  expect(lt5Atom.getValue()).toBe(true)

  baseAtom.update(2)
  expect(baseAtomUpdates).toBe(4)
  expect(gt0Updates).toBe(3)
  expect(lt5Updates).toBe(2)
  expect(gt0Atom.getValue()).toBe(true)
  expect(lt5Atom.getValue()).toBe(true)
})
