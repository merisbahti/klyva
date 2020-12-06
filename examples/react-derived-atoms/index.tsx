import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import { atom, useAtom } from '../../src/index'

const count = atom(0)
const p1atom = atom(get => get(count) + 1)
const p2atom = atom(get => get(count) + 2)
const composite = atom(get => ({
  c: get(count),
  p1: get(p1atom),
  p2: get(p2atom),
}))

const App = () => {
  const [, setCount] = useAtom(count)
  const [{ c, p1, p2 }] = useAtom(composite)
  return (
    <div>
      <pre>
        {c} - {p1} - {p2}
        working
      </pre>
      <button onClick={() => setCount(v => v + 1)}>+</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
