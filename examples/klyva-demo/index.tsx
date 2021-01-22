import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  atom,
  focusAtom,
  RemovableAtom,
  useAtom,
  useAtomSlice,
} from '../../src/index'

const myAtom = atom('hello')

const Component = () => {
  const [text, setText] = useAtom(myAtom)

  const onClick = () => setText(text => text + '!')

  return <button onClick={onClick}>{text}</button>
}

const bigAtom = atom({ count: 5, name: 'meris' })
const counterAtom = focusAtom(bigAtom, optic => optic.prop('count'))

counterAtom.update(10)
counterAtom.getValue() // 10
bigAtom.getValue() // { count: 10, name: "meris" }

bigAtom.update({ count: 20, name: 'meris' })
counterAtom.getValue() // 20
bigAtom.getValue() // { count: 20, name: "meris" }

const Counter = ({ countAtom }: { countAtom: RemovableAtom<number> }) => {
  const [count, setCount] = useAtom(countAtom)
  const inc = () => setCount(count => count + 1)
  return (
    <div>
      <button onClick={inc}>{count}</button>
      <button onClick={countAtom.remove}>Remove</button>
    </div>
  )
}

const listAtom = atom([1, 2, 3])

const CountList = () => {
  const countAtoms = useAtomSlice(listAtom)
  return (
    <div>
      {countAtoms.map((countAtom, index) => (
        <Counter key={index} countAtom={countAtom} />
      ))}
    </div>
  )
}

const App = () => {
  return (
    <div>
      <Component />
      <CountList />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
