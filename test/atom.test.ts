import { atom } from '../src/atom'
import { optic } from 'optics-ts'

test('the atom emits 1, 2, and 3', done => {
  const myAtom = atom(0)
  let latestValue = null
  myAtom.subscribe(next => {
    latestValue = next
  })
  expect(latestValue).toEqual(0)
  myAtom.update(1)
  expect(latestValue).toEqual(1)
  myAtom.update(2)
  expect(latestValue).toEqual(2)
  myAtom.update(3)
  expect(latestValue).toEqual(3)
  done()
})

test('the atom emits 1, 2, and 3 (using updater function)', done => {
  const myAtom = atom(0)
  let latestValue = null
  myAtom.subscribe(next => {
    latestValue = next
  })
  const inc = (num: number) => num + 1
  expect(latestValue).toEqual(0)
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
  const focusedAtom = myAtom.focus(optic<{ value: number }>().prop('value'))
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
  const focusedAtom = myAtom.focus(optic<{ value: number }>().prop('value'))
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

test("the parent emits even though its the focused atom's focused atom being nexted", done => {
  const value = { a: { b: 0 } }
  const myAtom = atom(value)
  const firstFocus = myAtom.focus(optic<typeof value>().prop('a'))
  const secondFocus = firstFocus.focus(optic<typeof value['a']>().prop('b'))
  let latestValue = null
  myAtom.subscribe(next => {
    latestValue = next
  })
  secondFocus.update(1)
  expect(latestValue).toEqual({ a: { b: 1 } })
  secondFocus.update(2)
  expect(latestValue).toEqual({ a: { b: 2 } })
  secondFocus.update(3)
  expect(latestValue).toEqual({ a: { b: 3 } })
  done()
})
