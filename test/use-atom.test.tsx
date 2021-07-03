import React from 'react'
import * as rtl from '@testing-library/react'
import { atom, focusAtom, Atom } from '../src'
import { useAtom, useAtomSlice, useSelector } from '../src/react-utils'
import { act } from 'react-dom/test-utils'

it('focus on an atom works', async () => {
  const anAtom = atom({ a: 5 })
  const Counter = ({ myAtom }: { myAtom: Atom<{ a: number }> }) => {
    const [myAtomValue] = useAtom(myAtom)
    const focusedA = React.useMemo(
      () => focusAtom(myAtom, optic => optic.prop('a')),
      [myAtom],
    )
    const [count] = useAtom(focusedA)
    return (
      <div>
        <div>bigAtom: {JSON.stringify(myAtomValue)}</div>
        <div>focusedAtom: {JSON.stringify(count)}</div>
        <button onClick={() => focusedA.update(value => value + 1)}>
          small inc
        </button>
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
  await findByText('focusedAtom: 5')

  rtl.fireEvent.click(getByText('small inc'))
  await findByText('focusedAtom: 6')
  await findByText('bigAtom: {"a":6}')

  rtl.fireEvent.click(getByText('big inc'))
  await findByText('focusedAtom: 8')
  await findByText('bigAtom: {"a":8}')
})

it('focus on a derived atom works', async () => {
  const anAtom = atom({ a: 5 })
  const derivedAtom = atom(get => get(anAtom).a + 1)

  const Counter = ({ myAtom }: { myAtom: Atom<{ a: number }> }) => {
    const [myAtomValue] = useAtom(myAtom)
    const [myDerivedAtomValue] = useAtom(derivedAtom)
    const focusedA = React.useMemo(
      () => focusAtom(myAtom, optic => optic.prop('a')),
      [myAtom],
    )
    const [count] = useAtom(focusedA)
    return (
      <div>
        <div>bigAtom: {JSON.stringify(myAtomValue)}</div>
        <div>focusedAtom: {JSON.stringify(count)}</div>
        <div>derivedAtom: {JSON.stringify(myDerivedAtomValue)}</div>
        <button onClick={() => focusedA.update(value => value + 1)}>
          small inc
        </button>
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
  await findByText('focusedAtom: 5')
  await findByText('derivedAtom: 6')

  rtl.fireEvent.click(getByText('small inc'))
  await findByText('focusedAtom: 6')
  await findByText('derivedAtom: 7')
  await findByText('bigAtom: {"a":6}')

  rtl.fireEvent.click(getByText('big inc'))
  await findByText('focusedAtom: 8')
  await findByText('bigAtom: {"a":8}')
  await findByText('derivedAtom: 9')
})

it('removal works without throwing', async () => {
  const arrArrAtom = atom([['hello', 'hello 2']])
  const Item = ({
    stringAtom,
    remove,
    index,
  }: {
    index: number
    stringAtom: Atom<string>
    remove: () => void
  }) => {
    const [str] = useAtom(stringAtom)
    return (
      <div>
        <input value={str} onChange={e => stringAtom.update(e.target.value)} />
        <button onClick={remove}>remove item {index}</button>
      </div>
    )
  }

  const ItemList = ({
    arrAtom,
    remove,
    index,
  }: {
    index: number
    arrAtom: Atom<string[]>
    remove: () => void
  }) => {
    const atoms = useAtomSlice(arrAtom)
    return (
      <div>
        {atoms.map((atom, index) => (
          <Item
            index={index}
            key={index}
            stringAtom={atom}
            remove={atom.remove}
          />
        ))}
        <button onClick={remove}>remove array {index}</button>
      </div>
    )
  }

  const App = () => {
    const atoms = useAtomSlice(arrArrAtom)
    return (
      <div>
        <h1>Klyva</h1>
        {atoms.map((atom, index) => (
          <ItemList
            key={index}
            index={index}
            arrAtom={atom}
            remove={atom.remove}
          />
        ))}
      </div>
    )
  }

  const { getByText } = rtl.render(<App />)

  rtl.fireEvent.click(getByText('remove item 0'))
  rtl.fireEvent.click(getByText('remove item 0'))
  //rtl.fireEvent.click(getByText('remove array'))
})

const useUpdateCount = () => {
  const count = React.useRef(0)
  React.useEffect(() => {
    count.current += 1
  })
  return count.current
}

it('updates are batched (onclick)', async () => {
  const anAtom = atom(5)
  const p1atom = atom(get => get(anAtom) + 1)
  const p2atom = atom(get => get(anAtom) + 2)
  const derivedAtom = atom(get => ({
    c: get(anAtom),
    p1: get(p1atom),
    p2: get(p2atom),
  }))
  const Counter = () => {
    const derivedAtomValue = useSelector(derivedAtom)
    useSelector(p1atom)
    useSelector(p2atom)
    useSelector(anAtom)
    const updates = useUpdateCount()
    return (
      <div>
        <div>updates: {updates}</div>
        <div>derivedAtom: {JSON.stringify(derivedAtomValue)}</div>
        <button onClick={() => anAtom.update(value => value + 1)}>inc</button>
      </div>
    )
  }

  const { getByText, findByText } = rtl.render(<Counter />)

  await findByText('updates: 0')
  await findByText('derivedAtom: {"c":5,"p1":6,"p2":7}')
  rtl.fireEvent.click(getByText('inc'))

  await findByText('updates: 1')
  await findByText('derivedAtom: {"c":6,"p1":7,"p2":8}')

  rtl.fireEvent.click(getByText('inc'))
  await findByText('updates: 2')
  await findByText('derivedAtom: {"c":7,"p1":8,"p2":9}')
})

it('updates are batched (useEffect)', async () => {
  const countAtom = atom(5)
  const p1atom = atom(get => get(countAtom) + 1)
  const p2atom = atom(get => get(countAtom) + 2)
  const derivedAtom = atom(get => ({
    c: get(countAtom),
    p1: get(p1atom),
    p2: get(p2atom),
  }))
  const Counter = () => {
    const [, setCount] = useAtom(countAtom)
    const [myAtomValue] = useAtom(derivedAtom)
    useAtom(p1atom)
    useAtom(p2atom)
    const updates = useUpdateCount()
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setCount(value => value + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }, [setCount])
    return (
      <div>
        <div>updates: {updates}</div>
        <div>derivedAtom: {JSON.stringify(myAtomValue)}</div>
      </div>
    )
  }

  const { findByText, queryByText } = rtl.render(<Counter />)

  await findByText('updates: 0')
  await findByText('derivedAtom: {"c":5,"p1":6,"p2":7}')

  const twoUpdates = await queryByText('updates: 2')

  await findByText('updates: 1')
  await findByText('derivedAtom: {"c":6,"p1":7,"p2":8}')

  expect(twoUpdates).toBe(null)
})

it('if atom changes reference, it updates its value', async () => {
  const atomLeft = atom(0)
  const atomRight = atom(10)
  const Counter = () => {
    const [left, setLeft] = React.useState(true)
    const [value, setValue] = useAtom(left ? atomLeft : atomRight)
    return (
      <div>
        <button onClick={() => setLeft(value => !value)}>Toggle atom</button>
        <button onClick={() => setValue(value => value + 1)}>inc</button>
        <div>value: {JSON.stringify(value)}</div>
        <div>incCurrent: {JSON.stringify(value)}</div>
      </div>
    )
  }

  const { getByText, findByText } = rtl.render(<Counter />)

  await findByText('value: 0')
  rtl.fireEvent.click(getByText('inc'))
  await findByText('value: 1')

  rtl.fireEvent.click(getByText('Toggle atom'))
  await findByText('value: 10')

  rtl.fireEvent.click(getByText('inc'))
  await findByText('value: 11')

  rtl.fireEvent.click(getByText('Toggle atom'))
  await findByText('value: 1')
})

it('endless react loop', async done => {
  const baseAtom = atom({ a: 5, b: 10 })

  const App = () => {
    const [derivedState] = useAtom(
      atom(get => {
        const values = get(baseAtom)
        return { type: 'success', value: values.a + values.b }
      }),
    )
    return (
      <>
        <button
          onClick={() =>
            baseAtom.update(oldValue => ({
              a: oldValue.a + 1,
              b: oldValue.b + 1,
            }))
          }
        >
          inc
        </button>
        <pre>{JSON.stringify(derivedState)}</pre>
      </>
    )
  }

  const { getByText, findByText } = rtl.render(<App />)

  await findByText('{"type":"success","value":15}')
  rtl.fireEvent.click(getByText('inc'))
  await findByText('{"type":"success","value":17}')
  done()
}, 1000)

it('able to store a derived function in react', async () => {
  const countAtom = atom(0)
  const fnAtom = atom(get => {
    const value = get(countAtom)
    return () => value + 5
  })
  const Counter = () => {
    const [fnAtomValue] = useAtom(fnAtom)
    return (
      <div>
        <div>fnAtomValue: {fnAtomValue()}</div>
      </div>
    )
  }

  const { findByText } = rtl.render(<Counter />)

  await findByText('fnAtomValue: 5')

  act(() => countAtom.update(c => c + 1))

  await findByText('fnAtomValue: 6')
})
