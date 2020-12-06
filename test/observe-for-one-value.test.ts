import subscribe from 'callbag-subscribe'
import { atom } from '../src/atom'
import { atomToSource } from '../src/atom-to-source'

/*
test('isomorphisms work', done => {
  const myAtom = atom(0)

  const observer = observeForOneValue(myAtom)

  let isCompleted = false
  let value: number | null = null
  let error: Error | null = null

  observer.subscribe(
    val => {
      value = val
    },
    err => {
      error = err
    },
    () => {
      isCompleted = true
    },
  )

  expect(isCompleted).toBe(false)
  expect(value).toBe(null)
  expect(error).toBe(null)

  myAtom.update(1)
  expect(isCompleted).toBe(true)
  expect(value).toBe(1)
  expect(error).toBe(null)
  done()
})
*/

test('atomtosource', () => {
  const numberAtom = atom(0)
  const callbagSource = atomToSource(numberAtom)
  let latestValue = null
  subscribe(v => (latestValue = v))(callbagSource)
  expect(latestValue).toBe(null)

  numberAtom.update(1)
  expect(latestValue).toBe(1)

  numberAtom.update(2)
  expect(latestValue).toBe(2)

  numberAtom.update(3)
  expect(latestValue).toBe(3)
})
