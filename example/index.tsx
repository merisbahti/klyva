import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useNewAtom } from '../src/react-utils'
import focusAtom from '../src/focus-atom'
import sliceAtomArray from '../src/slice-atom-array'

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
  const slicedAtom = sliceAtomArray(items)
  // const itemAtoms = useAtom(slicedAtom)

  return (
    <div>
      {
        /*itemAtoms.map(itemAtom => (
        <TodoItem item={itemAtom} />
      ))*/ null
      }
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
  const myAtom = useNewAtom([])
  const myitem = useNewAtom({ checked: false, task: 'hello' })
  return (
    <div>
      <TodoItem item={myitem} />
      <TodoList items={myAtom} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
