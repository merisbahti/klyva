import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import {
  atom,
  focusAtom,
  useAtom,
  useAtomSlice,
  useSelector,
} from '../src/index'
import { PrimitiveAtom } from '../src/types'

const CheckBox = ({ checkedAtom }: { checkedAtom: PrimitiveAtom<boolean> }) => {
  const checked = useSelector(checkedAtom)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => checkedAtom.update(!checked)}
    />
  )
}

const TextInput = ({ textAtom }: { textAtom: PrimitiveAtom<string> }) => {
  const text = useSelector(textAtom)
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

const TodoList = ({
  todoListAtom,
}: {
  todoListAtom: PrimitiveAtom<TodoListAtomType>
}) => {
  const filter = useSelector(
    focusAtom(todoListAtom, optic => optic.prop('filter')),
  )
  const filterFunction = (todo: TodoType) => {
    if (filter === 'completed') {
      return todo.checked
    }
    if (filter === 'uncompleted') {
      return !todo.checked
    }
    return true
  }
  // Would like to do the following, however, the optics-ts library doesn't support removing of filtered atoms... yet
  // Watch for: https://github.com/akheron/optics-ts/pull/16
  // const todosAtom = focusAtom(todoListAtom, optic =>
  //   optic.prop('todos').filter(filterFunction),
  // )
  const todosAtom = focusAtom(todoListAtom, optic => optic.prop('todos'))
  // Workaround to observe the "filtered length" until the above issue is resolved...
  // We really would like to filter in the optic instead, and skip this.
  // Watch for: https://github.com/akheron/optics-ts/pull/16
  useSelector(todosAtom, todos => todos.filter(filterFunction).length)
  const todoAtoms = useAtomSlice(todosAtom)
  const [newTodo, setNewTodo] = React.useState('')

  return (
    <>
      <input
        value={newTodo}
        placeholder="New todo"
        onKeyUp={e => {
          if (e.key === 'Enter') {
            todosAtom.update(todos => [
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
          // Watch for: https://github.com/akheron/optics-ts/pull/16
          // We can remove the getValue here if we do the filtering in the optic.
          .filter(atom => filterFunction(atom.getValue()))
          .map((todoAtom, index) => (
            <li key={index}>
              <TodoItem
                key={index}
                todoAtom={todoAtom}
                onRemove={todoAtom.remove}
              />
            </li>
          ))}
      </ul>
    </>
  )
}
type FilterType = 'all' | 'completed' | 'uncompleted'
type TodoListAtomType = {
  filter: FilterType
  todos: Array<TodoType>
}
const todoListAtom = atom<TodoListAtomType>({
  filter: 'all',
  todos: [
    { task: 'Handle the dragon', checked: false },
    { task: 'Drink some water', checked: false },
  ],
})

const App = () => {
  const filterAtom = focusAtom(todoListAtom, optic => optic.prop('filter'))
  return (
    <div>
      <TodoList todoListAtom={todoListAtom} />
      <Filter filterAtom={filterAtom} />
    </div>
  )
}

const Filter = ({ filterAtom }: { filterAtom: PrimitiveAtom<FilterType> }) => {
  const filter = useAtom(filterAtom)
  return (
    <>
      <div onClick={() => filterAtom.update('all')}>
        <input type="radio" id="all" readOnly checked={filter === 'all'} />
        <label htmlFor="all">All</label>
      </div>
      <div onClick={() => filterAtom.update('completed')}>
        <input
          type="radio"
          id="completed"
          readOnly
          checked={filter === 'completed'}
        />
        <label htmlFor="completed">Completed</label>
      </div>
      <div onClick={() => filterAtom.update('uncompleted')}>
        <input
          type="radio"
          id="uncompleted"
          value="uncompleted"
          readOnly
          checked={filter === 'uncompleted'}
        />
        <label htmlFor="uncompleted">Uncompleted</label>
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
