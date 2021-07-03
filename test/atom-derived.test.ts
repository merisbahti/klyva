import { atom, Updater } from '../src'

test('simple derivation with 1 atom works', done => {
  const atomA = atom(10)

  const derived = atom(get => get(atomA) + 1)

  expect(atomA.getValue()).toBe(10)
  expect(derived.getValue()).toBe(11)

  atomA.update(1)
  expect(atomA.getValue()).toBe(1)
  expect(derived.getValue()).toBe(2)

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

  expect(updates.A).toBe(0)
  expect(updates.B).toBe(0)
  expect(updates.derived).toBe(0)
  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomA.update(9)

  expect(updates.A).toBe(1)
  expect(updates.B).toBe(0)
  expect(updates.derived).toBe(0)
  expect(atomA.getValue()).toBe(9)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomA.update(8)

  expect(updates.A).toBe(2)
  expect(updates.B).toBe(0)
  expect(updates.derived).toBe(0)
  expect(atomA.getValue()).toBe(8)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe(false)

  atomB.update(20)
  expect(updates.A).toBe(2)
  expect(updates.B).toBe(1)
  expect(updates.derived).toBe(1)
  expect(atomA.getValue()).toBe(8)
  expect(atomB.getValue()).toBe(20)
  expect(derived.getValue()).toBe(true)
  done()
})

test('advanced derivation with multiple dependencies work as expected', done => {
  const atomA = atom(10)
  const atomB = atom(5)
  const atomC = atom('then')
  const derived = atom(get => (get(atomA) < get(atomB) ? get(atomC) : 'else'))

  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toBe('else')

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

test('composite atoms work', done => {
  const atomA = atom(10)
  const atomB = atom(5)
  const derived = atom(
    get => ({
      a: get(atomA),
      b: get(atomB),
      sum: get(atomA) + get(atomB),
    }),
    (update: Updater<{ a: number; b: number }>) => {
      const { a, b } =
        update instanceof Function
          ? update({ a: atomA.getValue(), b: atomB.getValue() })
          : update
      atomA.update(a)
      atomB.update(b)
    },
  )

  let atomAUpdates = 0
  let atomBUpdates = 0
  let derivedAtomUpdates = 0

  derived.subscribe(() => (derivedAtomUpdates += 1))
  atomA.subscribe(() => (atomAUpdates += 1))
  atomB.subscribe(() => (atomBUpdates += 1))

  expect(atomAUpdates).toBe(0)
  expect(atomBUpdates).toBe(0)
  expect(derivedAtomUpdates).toBe(0)
  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toStrictEqual({ a: 10, b: 5, sum: 15 })

  atomA.update(0)
  expect(atomAUpdates).toBe(1)
  expect(atomBUpdates).toBe(0)
  expect(derivedAtomUpdates).toBe(1)
  expect(atomA.getValue()).toBe(0)
  expect(atomB.getValue()).toBe(5)
  expect(derived.getValue()).toStrictEqual({ a: 0, b: 5, sum: 5 })

  atomB.update(20)
  expect(atomAUpdates).toBe(1)
  expect(atomBUpdates).toBe(1)
  expect(derivedAtomUpdates).toBe(2)
  expect(atomA.getValue()).toBe(0)
  expect(atomB.getValue()).toBe(20)
  expect(derived.getValue()).toStrictEqual({ a: 0, b: 20, sum: 20 })

  derived.update({ a: 10, b: 30 })
  expect(atomAUpdates).toBe(2)
  expect(atomBUpdates).toBe(2)
  expect(derivedAtomUpdates).toBe(4)
  expect(atomA.getValue()).toBe(10)
  expect(atomB.getValue()).toBe(30)
  expect(derived.getValue()).toStrictEqual({ a: 10, b: 30, sum: 40 })
  done()
})

test('composite atoms work even without extra subs', done => {
  const count = atom(0)
  const p1 = atom(get => get(count) + 10)
  const composite = atom(get => ({ c: get(count), p1: get(p1) }))

  expect(composite.getValue()).toStrictEqual({ c: 0, p1: 10 })
  expect(p1.getValue()).toBe(10)
  expect(count.getValue()).toBe(0)

  count.update(1)
  expect(composite.getValue()).toStrictEqual({ c: 1, p1: 11 })
  expect(count.getValue()).toBe(1)

  count.update(2)
  expect(composite.getValue()).toStrictEqual({ c: 2, p1: 12 })
  expect(count.getValue()).toBe(2)
  done()
})

test('composite atom works after resubscribe', done => {
  const count = atom(0)
  const derived = atom(get => get(count) + 1)

  let firstSubUpdates = 0
  let secondSubUpdates = 0
  const unsub = derived.subscribe(() => firstSubUpdates++)
  unsub()
  count.update(v => v + 1)
  const unsub2 = derived.subscribe(() => secondSubUpdates++)
  unsub2()
  count.update(v => v + 1)
  derived.subscribe(() => secondSubUpdates++)
  count.update(v => v + 1)

  expect(secondSubUpdates).toBe(1)

  done()
})

test('composite atom works after resubscribe 2', done => {
  const leftOrRight = atom<'left' | 'right'>('left')
  const left = atom(-10)
  const right = atom(10)
  const derived = atom(get =>
    get(leftOrRight) === 'left' ? get(left) : get(right),
  )

  leftOrRight.update('right')

  let derivedUpdates = 0
  let derivedValue = 0

  derived.subscribe(v => {
    derivedValue = v
    derivedUpdates++
  })

  right.update(v => v + 1)

  expect(derivedUpdates).toBe(1)
  expect(derivedValue).toBe(11)

  expect(derived.getValue()).toBe(11)

  done()
})
