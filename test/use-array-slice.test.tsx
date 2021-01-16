import React from 'react'
import * as rtl from '@testing-library/react'
import { atom } from '../src'
import { Atom } from '../src/types'
import { useAtom, useAtomSlice, useSelector } from '../src/react-utils'

it('useArraySlice removal works', async () => {
  const anAtom = atom(['foo', 'bar', 'baz'])
  const Counter = ({ myAtom }: { myAtom: Atom<string[]> }) => {
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
  const Counter = ({ myAtom }: { myAtom: Atom<string[]> }) => {
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

const useUpdateCount = () => {
  const count = React.useRef(0)
  React.useEffect(() => {
    count.current += 1
  })
  return count.current
}

it('useArraySlice, updating a sibling atom does not update other siblings', async () => {
  const anAtom = atom([{ count: 0 }, { count: 0 }])
  const CounterList = ({ myAtom }: { myAtom: Atom<{ count: number }[]> }) => {
    const atoms = useAtomSlice(myAtom)
    return (
      <div>
        {atoms.map((atom, id) => (
          <Counter id={id} key={id} countAtom={atom} />
        ))}
      </div>
    )
  }

  const Counter = ({
    countAtom,
    id,
  }: {
    id: number
    countAtom: Atom<{ count: number }>
  }) => {
    const [count, setCount] = useAtom(countAtom)
    const updates = useUpdateCount()
    return (
      <button key={id} onClick={() => setCount(v => ({ count: v.count + 1 }))}>
        id: {id}, count: {count.count}, updates: {updates}
      </button>
    )
  }

  const { getByText, findByText /*, queryByText*/ } = rtl.render(
    <CounterList myAtom={anAtom} />,
  )

  await findByText('id: 0, count: 0, updates: 0')
  await findByText('id: 1, count: 0, updates: 0')

  rtl.fireEvent.click(getByText('id: 0, count: 0, updates: 0'))
  await findByText('id: 0, count: 1, updates: 1')
  await findByText('id: 1, count: 0, updates: 0')

  rtl.fireEvent.click(getByText('id: 1, count: 0, updates: 0'))
  await findByText('id: 0, count: 1, updates: 1')
  await findByText('id: 1, count: 1, updates: 1')
})
