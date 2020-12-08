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
/*
it('selection on an atom works', async () => {
  const anAtom = atom({ a: 5 })
  const Counter = ({ myAtom }: { myAtom: PrimitiveAtom<{ a: number }> }) => {
    const [myAtomValue] = useAtom(myAtom)
    const selectedA = useSelector(myAtom, value => value.a)
    return (
      <div>
        <div>bigAtom: {JSON.stringify(myAtomValue)}</div>
        <div>selectedAtom: {JSON.stringify(selectedA)}</div>
        <button
          onClick={() =>
            myAtom.update(value => ({
              a: value.a + 3,
            }))
          }
        >
          big inc
        </button>
      </div>
    )
  }

  const { getByText, findByText } = rtl.render(<Counter myAtom={anAtom} />)

  await findByText('bigAtom: {"a":5}')
  await findByText('selectedAtom: 5')

  rtl.fireEvent.click(getByText('big inc'))
  await findByText('selectedAtom: 8')
  await findByText('bigAtom: {"a":8}')
})

it('selection on a derived atom works', async () => {
  const anAtom = atom({ a: 5 })
  const derivedAtom = atom(get => get(anAtom).a + 1)

  const Counter = ({ myAtom }: { myAtom: PrimitiveAtom<{ a: number }> }) => {
    const [myAtomValue] = useAtom(myAtom)
    const [myDerivedAtomValue] = useAtom(derivedAtom)
    const selectedA = useSelector(derivedAtom, source => source + 2)
    const selectedIdentity = useSelector(derivedAtom)
    return (
      <div>
        <div>bigAtom: {JSON.stringify(myAtomValue)}</div>
        <div>focusedAtom: {JSON.stringify(selectedA)}</div>
        <div>selectedIdentity: {JSON.stringify(selectedIdentity)}</div>
        <div>derivedAtom: {JSON.stringify(myDerivedAtomValue)}</div>
        <button
          onClick={() =>
            myAtom.update(value => ({
              a: value.a + 2,
            }))
          }
        >
          big inc
        </button>
      </div>
    )
  }

  const { getByText, findByText } = rtl.render(<Counter myAtom={anAtom} />)

  await findByText('bigAtom: {"a":5}')
  await findByText('focusedAtom: 8')
  await findByText('selectedIdentity: 6')
  await findByText('derivedAtom: 6')

  rtl.fireEvent.click(getByText('big inc'))
  await findByText('focusedAtom: 10')
  await findByText('bigAtom: {"a":7}')
  await findByText('selectedIdentity: 8')
  await findByText('derivedAtom: 8')
})
*/
