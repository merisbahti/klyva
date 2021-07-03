import subscribe from 'callbag-subscribe'
import { atom } from '../src'
import { atomToSource } from '../src/inner-utils'

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
