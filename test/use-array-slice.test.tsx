import React from 'react'
import * as rtl from '@testing-library/react'
import { atom } from '../src'
import { PrimitiveAtom } from '../src/types'
import { useAtomSlice, useSelector } from '../src/react-utils'

it('useArraySlice removal works', async () => {
  const anAtom = atom(['foo', 'bar', 'baz'])
  const Counter = ({ myAtom }: { myAtom: PrimitiveAtom<string[]> }) => {
    const atoms = useAtomSlice(myAtom)
    return (
      <div>
        <LengthObserver />
        {atoms.map(atom => (
          <button key={atom.getValue()} onClick={() => atom.remove()}>
            {atom.getValue()}
          </button>
        ))}
      </div>
    )
  }

  const LengthObserver = () => {
    return <div>length: {useSelector(anAtom, arr => arr.length)}</div>
  }

  const { getByText, findByText, queryByText } = rtl.render(
    <Counter myAtom={anAtom} />,
  )

  await findByText('length: 3')
  await findByText('foo')
  await findByText('bar')
  await findByText('baz')

  rtl.fireEvent.click(getByText('bar'))
  await findByText('length: 2')
  await findByText('foo')
  await findByText('baz')

  const bar = queryByText('bar')
  expect(bar).toBeNull()
})

it('useArraySlice, filter, removal works', async () => {
  const anAtom = atom(['foo', 'bar', 'baz'])
  const Counter = ({ myAtom }: { myAtom: PrimitiveAtom<string[]> }) => {
    const atoms = useAtomSlice(myAtom, value => value.includes('a'))
    return (
      <div>
        <LengthObserver />
        {atoms.map(atom => (
          <button key={atom.getValue()} onClick={() => atom.remove()}>
            {atom.getValue()}
          </button>
        ))}
      </div>
    )
  }

  const LengthObserver = () => {
    return <div>length: {useSelector(anAtom, arr => arr.length)}</div>
  }

  const { getByText, findByText, queryByText } = rtl.render(
    <Counter myAtom={anAtom} />,
  )

  await findByText('length: 3')
  expect(queryByText('foo')).toBeNull()
  await findByText('bar')
  await findByText('baz')

  rtl.fireEvent.click(getByText('bar'))
  await findByText('length: 2')
  expect(queryByText('foo')).toBeNull()
  await findByText('baz')

  const bar = queryByText('bar')
  expect(bar).toBeNull()
})
