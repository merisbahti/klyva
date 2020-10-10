import React from 'react'
import * as rtl from '@testing-library/react'
import { atom } from '../src'
import { Atom } from '../src/types'
import { useAtom } from '../src/react-utils'

it('focus on an atom works', async () => {
  const anAtom = atom({ a: 5 })
  const Counter = ({ myAtom }: { myAtom: Atom<{ a: number }> }) => {
    const myAtomValue = useAtom(myAtom)
    const focusedA = React.useMemo(
      () => myAtom.focus(optic => optic.prop('a')),
      [myAtom],
    )
    const count = useAtom(focusedA)
    return (
      <div>
        <div>bigAtom: {JSON.stringify(myAtomValue)}</div>
        <div>focusedAtom: {count}</div>
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
    const myAtomValue = useAtom(myAtom)
    const myDerivedAtomValue = useAtom(derivedAtom)
    const focusedA = React.useMemo(
      () => myAtom.focus(optic => optic.prop('a')),
      [myAtom],
    )
    const count = useAtom(focusedA)
    return (
      <div>
        <div>bigAtom: {JSON.stringify(myAtomValue)}</div>
        <div>focusedAtom: {count}</div>
        <div>derivedAtom: {myDerivedAtomValue}</div>
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
