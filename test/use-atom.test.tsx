import React from 'react'
import * as rtl from '@testing-library/react'
import { atom } from '../src'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useAtomSlice } from '../src/react-utils'
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
  rtl.fireEvent.click(getByText('remove item 1'))
  //rtl.fireEvent.click(getByText('remove array'))
})
