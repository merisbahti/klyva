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
