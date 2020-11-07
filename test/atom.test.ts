import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test('the atom emits 1, 2, and 3', done => {
  const myAtom = atom(0)
  let latestValue = null
  const unsub = myAtom.subscribe(next => {
    latestValue = next
  })
  expect(latestValue).toEqual(null)
  myAtom.update(1)
  expect(latestValue).toEqual(1)
  myAtom.update(2)
  expect(latestValue).toEqual(2)
  myAtom.update(3)
  expect(latestValue).toEqual(3)
  unsub()
  done()
})

test('the atom emits 1, 2, and 3 (using updater function)', done => {
  const myAtom = atom(0)
  let latestValue = null
  myAtom.subscribe(next => {
    latestValue = next
  })
  const inc = (num: number) => num + 1
  expect(latestValue).toEqual(null)
  myAtom.update(inc)
  expect(latestValue).toEqual(1)
  myAtom.update(inc)
  expect(latestValue).toEqual(2)
  myAtom.update(inc)
  expect(latestValue).toEqual(3)
  done()
})

test('the focused atoms emit even though its the parent being nexted', done => {
  const myAtom = atom({ value: 0 })
  const focusedAtom = focusAtom(myAtom, optic => optic.prop('value'))
  let latestValue = null
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
  const focusedAtom = focusAtom(myAtom, optic => optic.prop('value'))
  let latestValue = null
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

test.only("the parent emits even though its the focused atom's focused atom being nexted", done => {
  const value = { a: { b: 0 } }
  const myAtom = atom(value)
  const firstFocus = focusAtom(myAtom, optic => optic.prop('a'))
  const secondFocus = focusAtom(firstFocus, optic => optic.prop('b'))
  let latestValue = null
  myAtom.subscribe(next => {
    console.log('myAtom updated', next)
    latestValue = next
  })
  firstFocus.subscribe(next => {
    console.log('firstFocus updated', next)
  })
  secondFocus.subscribe(next => {
    console.log('secondFocus updated', next)
  })

  myAtom.update({ a: { b: 1 } })
  expect(latestValue).toEqual({ a: { b: 1 } })
  expect(myAtom.getValue()).toEqual({ a: { b: 1 } })
  expect(firstFocus.getValue()).toEqual({ b: 1 })
  expect(secondFocus.getValue()).toEqual(1)

  secondFocus.update(2)
  expect(latestValue).toEqual({ a: { b: 2 } })
  expect(firstFocus.getValue()).toEqual({ b: 2 })
  expect(secondFocus.getValue()).toEqual(2)
  expect(myAtom.getValue()).toEqual({ a: { b: 2 } })

  secondFocus.update(3)
  expect(latestValue).toEqual({ a: { b: 3 } })
  expect(firstFocus.getValue()).toEqual({ b: 3 })
  expect(secondFocus.getValue()).toEqual(3)
  expect(myAtom.getValue()).toEqual({ a: { b: 3 } })
  done()
})
