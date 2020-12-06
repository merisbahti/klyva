import React from 'react'
import * as rtl from '@testing-library/react'
import { atom } from '../src'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useAtomSlice, useSelector } from '../src/react-utils'
import focusAtom from '../src/focus-atom'

it('focus on an atom works', async () => {
  const anAtom = atom({ a: 5 })
  const Counter = ({ myAtom }: { myAtom: PrimitiveAtom<{ a: number }> }) => {
    const myAtomValue = useAtom(myAtom)
    const focusedA = React.useMemo(
      () => focusAtom(myAtom, optic => optic.prop('a')),
      [myAtom],
    )
    const count = useAtom(focusedA)
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

  const Counter = ({ myAtom }: { myAtom: PrimitiveAtom<{ a: number }> }) => {
    const myAtomValue = useAtom(myAtom)
    const myDerivedAtomValue = useAtom(derivedAtom)
    const focusedA = React.useMemo(
      () => focusAtom(myAtom, optic => optic.prop('a')),
      [myAtom],
    )
    const count = useAtom(focusedA)
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
    stringAtom: PrimitiveAtom<string>
    remove: () => void
  }) => {
    const str = useAtom(stringAtom)
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
    arrAtom: PrimitiveAtom<string[]>
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
    const myAtomValue = useSelector(derivedAtom)
    const updates = useUpdateCount()
    return (
      <div>
        <div>updates: {updates}</div>
        <div>derivedAtom: {JSON.stringify(myAtomValue)}</div>
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
  const anAtom = atom(5)
  const p1atom = atom(get => get(anAtom) + 1)
  const p2atom = atom(get => get(anAtom) + 2)
  const derivedAtom = atom(get => ({
    c: get(anAtom),
    p1: get(p1atom),
    p2: get(p2atom),
  }))
  const Counter = () => {
    const myAtomValue = useSelector(derivedAtom)
    useSelector(p1atom)
    useSelector(p2atom)
    const updates = useUpdateCount()
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        anAtom.update(value => value + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }, [])
    return (
      <div>
        <div>updates: {updates}</div>
        <div>derivedAtom: {JSON.stringify(myAtomValue)}</div>
      </div>
    )
  }

  const { findByText } = rtl.render(<Counter />)

  await findByText('updates: 0')
  await findByText('derivedAtom: {"c":5,"p1":6,"p2":7}')

  await findByText('updates: 1')
  await findByText('derivedAtom: {"c":6,"p1":7,"p2":8}')
})
