import { atom } from '../src'
import sliceAtomArray from '../src/slice-atom-array'

test('sliced work', done => {
  const arrayAtom = atom([1, 2, 3])
  const [focus0, focus1] = sliceAtomArray(arrayAtom).getValue()

  let focus0Updates = 0
  let focus1Updates = 0
  let myAtomUpdates = 0

  focus0.subscribe(() => {
    focus0Updates += 1
  })
  focus1.subscribe(() => {
    focus1Updates += 1
  })
  arrayAtom.subscribe(() => {
    myAtomUpdates += 1
  })

  expect(focus0Updates).toEqual(0)
  expect(focus1Updates).toEqual(0)
  expect(myAtomUpdates).toEqual(0)
  expect(arrayAtom.getValue()).toEqual([1, 2, 3])
  expect(focus0.getValue()).toEqual(1)
  expect(focus1.getValue()).toEqual(2)

  focus1.update(val => val + 2)
  focus0.update(val => val + 1)
  expect(arrayAtom.getValue()).toEqual([2, 4, 3])
  expect(focus0.getValue()).toEqual(2)
  expect(focus1.getValue()).toEqual(4)
  expect(focus0Updates).toEqual(1)
  expect(focus1Updates).toEqual(1)
  expect(myAtomUpdates).toEqual(2)
  done()
})
