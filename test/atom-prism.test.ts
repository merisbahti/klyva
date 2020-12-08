import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test('prisms work', done => {
  const baseAtom = atom([1, 2, 3])
  const focus0 = focusAtom(baseAtom, optic => optic.index(0))
  const focus1 = focusAtom(baseAtom, optic => optic.index(1))
  const focus3 = focusAtom(baseAtom, optic => optic.index(3))

  let focus0Updates = 0
  let focus1Updates = 0
  let focus3Updates = 0
  let baseAtomUpdates = 0

  focus0.subscribe(() => (focus0Updates += 1))
  focus1.subscribe(() => (focus1Updates += 1))
  focus3.subscribe(() => (focus3Updates += 1))
  baseAtom.subscribe(() => (baseAtomUpdates += 1))

  expect(baseAtom.getValue()).toEqual([1, 2, 3])
  expect(focus0.getValue()).toEqual(1)
  expect(focus1.getValue()).toEqual(2)
  expect(focus3.getValue()).toEqual(undefined)
  expect(focus0Updates).toEqual(0)
  expect(focus1Updates).toEqual(0)
  expect(focus3Updates).toEqual(0)
  expect(baseAtomUpdates).toEqual(0)

  focus0.update(val => val + 1)
  focus1.update(4)
  focus3.update(val => val + 3)
  expect(baseAtom.getValue()).toEqual([2, 4, 3])
  expect(focus0.getValue()).toEqual(2)
  expect(focus1.getValue()).toEqual(4)
  expect(focus3.getValue()).toEqual(undefined)
  expect(focus0Updates).toEqual(1)
  expect(focus1Updates).toEqual(1)
  expect(focus3Updates).toEqual(0)
  expect(baseAtomUpdates).toEqual(2)
  done()
})

test('read-only prisms (AffineFold) crash', done => {
  const baseAtom = atom([1, 2, 3])
  const affineFoldAtom = focusAtom(baseAtom, optic =>
    optic.index(0).to(v => v + 1),
  )
  baseAtom.update(v => v.map(x => x + 1))
  expect(affineFoldAtom.getValue()).toBe(3)

  done()
})
