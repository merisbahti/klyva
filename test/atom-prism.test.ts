import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test('prisms work', done => {
  const myAtom = atom([1, 2, 3])
  const focus0 = focusAtom(myAtom, optic => optic.index(0))
  const focus1 = focusAtom(myAtom, optic => optic.index(1))
  const focus3 = focusAtom(myAtom, optic => optic.index(3))

  let focus0Updates = 0
  let focus1Updates = 0
  let focus3Updates = 0
  let myAtomUpdates = 0

  focus0.subscribe(() => (focus0Updates += 1))
  focus1.subscribe(() => (focus1Updates += 1))
  focus3.subscribe(() => (focus3Updates += 1))
  myAtom.subscribe(() => (myAtomUpdates += 1))

  expect(focus0Updates).toEqual(1)
  expect(focus1Updates).toEqual(1)
  expect(focus3Updates).toEqual(1)
  expect(myAtomUpdates).toEqual(1)
  expect(myAtom.getValue()).toEqual([1, 2, 3])
  expect(focus0.getValue()).toEqual(1)
  expect(focus1.getValue()).toEqual(2)
  expect(focus3.getValue()).toEqual(undefined)

  focus0.update(val => val + 1)
  focus1.update(val => val + 2)
  focus3.update(val => val + 3)
  expect(myAtom.getValue()).toEqual([2, 4, 3])
  expect(focus0.getValue()).toEqual(2)
  expect(focus1.getValue()).toEqual(4)
  expect(focus3.getValue()).toEqual(undefined)
  expect(focus0Updates).toEqual(2)
  expect(focus1Updates).toEqual(2)
  expect(focus3Updates).toEqual(1)
  expect(myAtomUpdates).toEqual(3)
  done()
})
