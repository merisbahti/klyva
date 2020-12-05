import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import {
  atom,
  useAtom,
} from '../../src/index'


const count = atom(0)
const p1atom = atom(get => get(count) + 1)
const p2atom = atom(get => get(count) + 2)
const composite = atom(get => ({ c: get(count), p1: get(p1atom), p2: get(p2atom) }))

console.log('hello')
const App = () => {
  const { c, p1, p2 } = useAtom(composite)
  const p1self = useAtom(p1atom)
  const p2self = useAtom(p2atom)
  console.log(c)
  console.log(p1, p1self)
  console.log(p2, p2self)
  return (
    <div>
      <pre>{c} - {p1} - {p2}</pre>
      <button onClick={() => count.update(v => v + 1)}>+</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
