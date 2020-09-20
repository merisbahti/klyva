import { atom } from '../src/atom'
import observeForOneValue from '../src/observe-for-one-value'

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
