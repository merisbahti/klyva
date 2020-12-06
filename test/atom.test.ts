import { atom } from '../src/atom'
import focusAtom from '../src/focus-atom'

test.only('the atom emits 1, 2, and 3', done => {
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

test("the parent emits even though its the focused atom's focused atom being nexted", done => {
  const value = { a: { b: 0 } }
  const myAtom = atom(value)
  const firstFocus = focusAtom(myAtom, optic => optic.prop('a'))
  const secondFocus = focusAtom(firstFocus, optic => optic.prop('b'))
  let latestValue = null
  myAtom.subscribe(next => {
    latestValue = next
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

test('identity is perserved for values, equal changes should not change idenitity', done => {
  const value = { a: { b: 0 } }
  const myAtom = atom(value)
  const focusA = focusAtom(myAtom, optic => optic.prop('a'))

  let focusAUpdates = 0
  let myAtomUpdates = 0
  focusA.subscribe(() => (focusAUpdates += 1))
  myAtom.subscribe(() => (myAtomUpdates += 1))

  myAtom.update({ a: { b: 0 } })
  expect(focusAUpdates).toBe(0)
  expect(myAtomUpdates).toBe(0)
  expect(focusA.getValue()).toBe(value.a)
  expect(myAtom.getValue()).toBe(value)

  focusA.update({ b: 0 })
  expect(focusAUpdates).toBe(0)
  expect(myAtomUpdates).toBe(0)
  expect(focusA.getValue()).toBe(value.a)
  expect(myAtom.getValue()).toBe(value)

  done()
})

test('no extra updates for extra subscriptiosn', done => {
  const myAtom = atom(0)

  let sub1updates = 0
  let sub2updates = 0
  myAtom.subscribe(() => (sub1updates += 1))
  myAtom.subscribe(() => (sub2updates += 1))

  expect(sub1updates).toBe(0)
  expect(sub2updates).toBe(0)

  done()
})

test('stale atom detection', done => {
  const myAtom = atom(0)
  const derivedAtom = atom(get => get(myAtom) + 5)

  expect(myAtom.getValue()).toBe(0)
  expect(derivedAtom.getValue()).toBe(5)

  myAtom.update(1)
  expect(myAtom.getValue()).toBe(1)
  expect(derivedAtom.getValue()).toBe(6)

  done()
})
