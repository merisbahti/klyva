import { atom } from '../src/atom'
import { optic } from 'optics-ts'

test('the observable interval emits 100 then 200 then 300', done => {
  const expectedValues = [0, 1, 2, 3]
  const myAtom = atom(0)
  let index = 0
  myAtom.subscribe(next => {
    expect(next).toEqual(expectedValues[index])
    index++
    if (index === expectedValues.length) {
      done()
    }
  })
  myAtom.update(1)
  myAtom.update(2)
  myAtom.update(3)
})

test('the focused atoms emit even though its the parent being nexted', done => {
  const myAtom = atom({ value: 0 })
  const focusedAtom = myAtom.focus(optic<{ value: number }>().prop('value'))
  let latestValue = 0
  focusedAtom.subscribe(next => {
    latestValue = next
  })
  myAtom.update({ value: 1 })
  expect(latestValue).toEqual(1)
  myAtom.update({ value: 2 })
  expect(latestValue).toEqual(2)
  myAtom.update({ value: 3 })
  expect(latestValue).toEqual(3)
  done()
})

test('the parent emits even though its the focused atom being nexted', done => {
  const myAtom = atom({ value: 0 })
  const focusedAtom = myAtom.focus(optic<{ value: number }>().prop('value'))
  let latestValue = { value: 0 }
  myAtom.subscribe(next => {
    latestValue = next
  })
  focusedAtom.update(1)
  expect(latestValue).toEqual({ value: 1 })
  focusedAtom.update(2)
  expect(latestValue).toEqual({ value: 2 })
  focusedAtom.update(3)
  expect(latestValue).toEqual({ value: 3 })
  done()
})

// test("the parent emits even though its the focused atom's focused atom being nexted", (done) => {
//   const myAtom = atom({ top: { value: 0 } })
//   const focusedAtom = myAtom.focus(optic<{ value: number }>().prop('value'))
//   let latestValue = { value: 0 }
//   myAtom.subscribe((next) => {
//     latestValue = next
//   })
//   focusedAtom.update(1)
//   expect(latestValue).toEqual({ value: 1 })
//   focusedAtom.update(2)
//   expect(latestValue).toEqual({ value: 2 })
//   focusedAtom.update(3)
//   expect(latestValue).toEqual({ value: 3 })
//   done()
// })
