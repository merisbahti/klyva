import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useNewAtom, useAtomSlice } from '../src/react-utils'
import focusAtom from '../src/focus-atom'

const TodoItem = ({
  item,
}: {
  item: PrimitiveAtom<{ checked: boolean; task: string }>
}) => {
  const taskAtom = focusAtom(item, o => o.prop('task'))
  const task = useAtom(taskAtom)

  const checkedAtom = focusAtom(item, o => o.prop('checked'))
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

const TodoList = ({
  items,
}: {
  items: PrimitiveAtom<Array<{ checked: boolean; task: string }>>
}) => {
  const itemAtoms = useAtomSlice(items)

  return (
    <div>
      {itemAtoms.map(itemAtom => (
        <TodoItem item={itemAtom} />
      ))}
      <button
        onClick={() =>
          items.update(arr => [...arr, { checked: false, task: 'new task!' }])
        }
      >
        New item
      </button>
    </div>
  )
}

const App = () => {
  const myAtom = useNewAtom([{ checked: false, task: 'hello' }])
  return (
    <div>
      <TodoList items={myAtom} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
