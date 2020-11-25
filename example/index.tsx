import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import { atom, focusAtom, useAtomSlice, useSelector } from '../src/index'
import { PrimitiveAtom } from '../src/types'

const CheckBox = ({ checkedAtom }: { checkedAtom: PrimitiveAtom<boolean> }) => {
  const checked = useSelector(checkedAtom, id => id)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => checkedAtom.update(!checked)}
    />
  )
}

const TextInput = ({ textAtom }: { textAtom: PrimitiveAtom<string> }) => {
  const text = useSelector(textAtom, id => id)
  return (
    <input
      type="text"
      value={text}
      onChange={event => textAtom.update(event.target.value)}
    />
  )
}
type TodoType = { task: string; checked: boolean }
const TodoItem = ({
  todoAtom,
  onRemove,
}: {
  todoAtom: PrimitiveAtom<TodoType>
  onRemove: () => void
}) => {
  const checkedAtom = focusAtom(todoAtom, optic => optic.prop('checked'))
  const textAtom = focusAtom(todoAtom, optic => optic.prop('task'))
  return (
    <>
      <CheckBox checkedAtom={checkedAtom} />
      <TextInput textAtom={textAtom} />
      <button onClick={onRemove}>X</button>
    </>
  )
}

type TodoListType = Array<TodoType>

const TodoList = ({
  todoListAtom,
  showCompleted,
}: {
  showCompleted: boolean
  todoListAtom: PrimitiveAtom<TodoListType>
}) => {
  const todoAtoms = useAtomSlice(todoListAtom)
  const [newTodo, setNewTodo] = React.useState('')

  return (
    <>
      <input
        value={newTodo}
        placeholder="New todo"
        onKeyUp={e => {
          if (e.key === 'Enter') {
            todoListAtom.update(todos => [
              ...todos,
              { task: newTodo, checked: false },
            ])
            setNewTodo('')
          }
        }}
        onChange={event => {
          setNewTodo(event.target.value)
        }}
      />
      <ul>
        {todoAtoms
          .filter(value => value.getValue().checked === showCompleted)
          .map((todoAtom, index) => {
            return (
              <li>
                <TodoItem
                  key={index}
                  todoAtom={todoAtom}
                  onRemove={todoAtom.remove}
                />
              </li>
            )
          })}
      </ul>
    </>
  )
}

const todoListAtom = atom([
  { task: 'Handle the dragon', checked: false },
  { task: 'Drink some water', checked: false },
])

const App = () => {
  const appState = useSelector(todoListAtom, id => id)
  const [showCompleted, setShowCompleted] = React.useState(false)
  return (
    <div>
      <TodoList todoListAtom={todoListAtom} showCompleted={showCompleted} />
      <button onClick={() => setShowCompleted(!showCompleted)}>
        Show completed ({JSON.stringify(showCompleted)})
      </button>
      <pre>{JSON.stringify(appState, null, 2)}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
