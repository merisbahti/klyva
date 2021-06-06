import { atom, sliceAtomObject } from '../src'

test('slicing atom object worked', done => {
  const objAtom = atom({ foo: 1, bar: true })
  const { foo, bar } = sliceAtomObject(objAtom)

  let latestFoo = foo.getValue()
  let fooUpdates = 0
  foo.subscribe(v => {
    latestFoo = v
    fooUpdates++
  })

  let latestBar = bar.getValue()
  let barUpdates = 0
  bar.subscribe(v => {
    latestBar = v
    barUpdates++
  })

  expect(latestFoo).toBe(1)
  expect(latestBar).toBe(true)

  foo.update(7)
  expect(latestFoo).toBe(7)
  expect(fooUpdates).toBe(1)
  expect(latestBar).toBe(true)
  expect(barUpdates).toBe(0)
  expect(objAtom.getValue()).toEqual({ foo: 7, bar: true })

  done()
})

test('removing object values worked', done => {
  const objAtom = atom({ foo: 1, bar: true })
  const { foo, bar } = sliceAtomObject(objAtom)

  bar.remove()
  foo.update(9)
  bar.update(false) // will be ignored

  expect(objAtom.getValue()).toEqual({ foo: 9 })

  expect(bar.getValue()).toBe(true) // should keep returning last "live" value

  done()
})
