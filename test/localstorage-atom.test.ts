import { localStorageAtom } from '../src'

it('getting and updating localStorageAtoms works', async () => {
  const atom = localStorageAtom(
    10,
    'myKey',
    (v): v is number => typeof v === 'number',
  )
  expect(localStorage.getItem('myKey')).toBe(null)
  expect(atom.getValue()).toBe(10)
  atom.update(20)
  expect(localStorage.getItem('myKey')).toBe('20')
  expect(atom.getValue()).toBe(20)
})

it('getting existing value from localstorage works', async () => {
  localStorage.setItem('myKey', '30')
  const atom = localStorageAtom(
    10,
    'myKey',
    (v): v is number => typeof v === 'number',
  )
  expect(localStorage.getItem('myKey')).toBe('30')
  expect(atom.getValue()).toBe(30)
  atom.update(20)
  expect(localStorage.getItem('myKey')).toBe('20')
  expect(atom.getValue()).toBe(20)
})

it('localstorage uses default argument if the item in localstorage failed validation', async () => {
  localStorage.setItem('myKey', '{"hello": "world"}')
  const atom = localStorageAtom(
    10,
    'myKey',
    (v): v is number => typeof v === 'number',
  )
  expect(atom.getValue()).toBe(10)
  expect(localStorage.getItem('myKey')).toBe('{"hello": "world"}')
  atom.update(v => v + 1)
  expect(localStorage.getItem('myKey')).toBe('11')
  expect(atom.getValue()).toBe(11)
})

it('works when no stored value and no verifier', async () => {
  localStorage.removeItem('myOtherKey')
  const atom = localStorageAtom(27, 'myOtherKey')
  expect(localStorage.getItem('myOtherKey')).toBe(null)
  expect(atom.getValue()).toBe(27)
  atom.update(20)
  expect(localStorage.getItem('myOtherKey')).toBe('20')
  expect(atom.getValue()).toBe(20)
})

it('works when stored value and no verifier', async () => {
  localStorage.setItem('myOtherKey', '35')
  const atom = localStorageAtom(27, 'myOtherKey')
  expect(localStorage.getItem('myOtherKey')).toBe('35')
  expect(atom.getValue()).toBe(35)
  atom.update(20)
  expect(localStorage.getItem('myOtherKey')).toBe('20')
  expect(atom.getValue()).toBe(20)
})

it('never calls verifier when no stored value', async () => {
  localStorage.removeItem('myOtherKey')
  const atom = localStorageAtom(27, 'myOtherKey', (v): v is number => {
    throw new Error(String(v))
  })
  expect(atom.getValue()).toBe(27)
})
