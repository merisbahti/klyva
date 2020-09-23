import { noop } from 'rxjs'
import { atom } from '../src/atom'

test('simple derivation with 1 atom works', done => {
  const atomA = atom(10)

  const derived = atom(get => get(atomA) + 1)
  const unsub = derived.subscribe(noop)

  expect(atomA.getValue()).toBe(10)
  expect(derived.getValue()).toBe(11)

  atomA.update(1)
  expect(atomA.getValue()).toBe(1)
  expect(derived.getValue()).toBe(2)

  unsub()
  done()
})

test('no unneccesary updates', done => {
  const atomA = atom(10)
  const atomB = atom(5)
  const derived = atom(get => get(atomA) < get(atomB))

  const updates = { A: 0, B: 0, derived: 0 }
  atomA.subscribe(() => {
    updates.A++
  })
  atomB.subscribe(() => {
    updates.B++
  })
  derived.subscribe(() => {
    updates.derived++
  })

  expect(updates.A).toBe(1)
  expect(updates.B).toBe(1)
  expect(updates.derived).toBe(1)
  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomA.update(9)

  expect(updates.A).toBe(2)
  expect(updates.B).toBe(1)
  // @TODO: unforunately this one is updated twice, since
  // valueSubject provides an initial update, but atom$ provides another
  expect(updates.derived).toBe(2)
  expect(atomA.getValue()).toBe(9)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomA.update(8)

  expect(updates.A).toBe(3)
  expect(updates.B).toBe(1)
  expect(updates.derived).toBe(2)
  expect(atomA.getValue()).toBe(8)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomB.update(20)
  expect(updates.A).toBe(3)
  expect(updates.B).toBe(2)
  expect(updates.derived).toBe(3)
  expect(atomA.getValue()).toBe(8)
  expect(atomB.getValue()).toBe(20)
  expect(derived.getValue()).toBe(true)
  done()
})

test('advanced derivation with multiple dependencies work as expected', done => {
  const atomA = atom(10)
  const atomB = atom(5)
  const atomC = atom('then')
  const derived = atom(get => (get(atomA) < get(atomB) ? get(atomC) : false))

  derived.subscribe(noop)

  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomA.update(0)
  expect(atomA.getValue()).toBe(0)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe('then')

  atomB.update(20)
  expect(atomA.getValue()).toBe(0)
  expect(atomB.getValue()).toBe(20)
  expect(derived.getValue()).toBe('then')
  done()
})
