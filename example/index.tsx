import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Atom } from '../src/types'
import { useAtom, useNewAtom } from '../src/react-utils'

const TodoItem = ({
  item,
}: {
  item: Atom<{ checked: boolean; task: string }>
}) => {
  const taskAtom = item.focus(o => o.prop('task'))
  const task = useAtom(taskAtom)

  const checkedAtom = item.focus(o => o.prop('checked'))
  const checked = useAtom(checkedAtom)

  return (
    <li>
      <input
        type="text"
        value={task}
        onChange={e => taskAtom.update(e.target.value)}
      />
      <input
        type="checkbox"
        checked={checked}
        onChange={e => checkedAtom.update(e.target.checked)}
      />
    </li>
  )
}

const App = () => {
  const myAtom = useNewAtom({ checked: false, task: 'Feed the cows' })
  return (
    <div>
      <TodoItem item={myAtom} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
