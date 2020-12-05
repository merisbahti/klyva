import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test('isomorphisms work', done => {
  const myAtom = atom(0)
  const there = (a: number) => a + 1
  const back = (a: number) => a - 1
  const myFocus = focusAtom(myAtom, optic => optic.iso(there, back))

  myAtom.update(1)
  expect(myAtom.getValue()).toEqual(1)
  expect(myFocus.getValue()).toEqual(2)
  done()
})
