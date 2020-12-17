import * as React from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import {
  focusAtom,
  localStorageAtom,
  useAtom,
  useAtomSlice,
  useSelector,
} from '../../src/index'
import { PrimitiveAtom } from '../../src/types'
import { FilterType, TodoListAtomType, TodoListTypeIO, TodoType } from './types'

const CheckBox = ({ checkedAtom }: { checkedAtom: PrimitiveAtom<boolean> }) => {
  const [checked, setChecked] = useAtom(checkedAtom)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => setChecked(!checked)}
    />
  )
}

const TextInput = ({ textAtom }: { textAtom: PrimitiveAtom<string> }) => {
  const [text, setText] = useAtom(textAtom)
  return (
    <input
      type="text"
      value={text}
      onChange={event => setText(event.target.value)}
    />
  )
}
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

const RemainingIndicator = ({
  todosAtom,
}: {
  todosAtom: PrimitiveAtom<TodoType[]>
}) => {
  const count = useSelector(
    todosAtom,
    todos => todos.filter((todo) => !todo.checked).length,
  )
  return (
    <span className="todo-count">
      <strong>{count}</strong> item{count === 1 ? '' : 's'} left
    </span>
  )
}

const ToggleAllButton = ({
  todosAtom,
}: {
  todosAtom: PrimitiveAtom<TodoType[]>
}) => {
  const allDone = useSelector(
    todosAtom,
    todos => !todos.some((todo) => !todo.checked),
  )
  const handleToggle = useCallback(() => {
    todosAtom.update(todos =>
      todos.map(todo => ({
        ...todo,
        checked: !allDone,
      })),
    )
  }, [todosAtom, allDone])
  return (
    <>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allDone}
        readOnly
      />
      <label onClick={handleToggle} htmlFor="toggle-all">
        Mark all as complete
      </label>
    </>
  )
}

const ClearCompletedButton = ({
  todosAtom,
}: {
  todosAtom: PrimitiveAtom<TodoType[]>
}) => {
  const handleClear = React.useCallback(() => {
    todosAtom.update(todos => todos.filter(todo => !todo.checked))
  }, [todosAtom])
  return (
    <button onClick={handleClear} className="clear-completed">
      Clear completed
    </button>
  )
}

const NewTodoInput = ({
  todosAtom,
}: {
  todosAtom: PrimitiveAtom<TodoType[]>
}) => {
  const [newTodo, setNewTodo] = React.useState('')
  return (
    <input
      className="new-todo"
      value={newTodo}
      placeholder="What needs to be done?"
      onKeyUp={e => {
        if (e.key === 'Enter') {
          todosAtom.update(todos => [
            { task: newTodo, checked: false },
            ...todos,
          ])
          setNewTodo('')
        }
      }}
      onChange={event => {
        setNewTodo(event.target.value)
      }}
    />
  )
}

const TodoList = ({
  todoListAtom,
}: {
  todoListAtom: PrimitiveAtom<TodoListAtomType>
}) => {
  const todosAtom = focusAtom(todoListAtom, optic => optic.prop('todos'))
  const filterAtom = focusAtom(todoListAtom, optic => optic.prop('filter'))
  const filter = useSelector(todoListAtom, value => value.filter)
  const visibleTodosAtom = useAtomSlice(
    todosAtom,
    ({ checked }) =>
      filter === 'all' ||
      (filter === 'completed' && checked) ||
      (filter === 'active' && !checked),
  )

  return (
    <>
      <header className="header">
        <h1>Todos</h1>
        <NewTodoInput todosAtom={todosAtom} />
      </header>
      <section className="main">
        <ToggleAllButton todosAtom={todosAtom} />
        <ul>
          {visibleTodosAtom.map((todoAtom, index) => (
            <li key={index}>
              <TodoItem
                key={index}
                todoAtom={todoAtom}
                onRemove={todoAtom.remove}
              />
            </li>
          ))}
        </ul>
        <footer className="footer">
          <RemainingIndicator todosAtom={todosAtom} />
          <Filter filterAtom={filterAtom} />
          <ClearCompletedButton todosAtom={todosAtom} />
        </footer>
      </section>
    </>
  )
}

const Filter = ({ filterAtom }: { filterAtom: PrimitiveAtom<FilterType> }) => {
  const [filter, setFilter] = useAtom(filterAtom)
  useEffect(() => {
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash
      if (newHash === '#/active') {
        setFilter('active')
      } else if (newHash === '#/completed') {
        setFilter('completed')
      } else {
        setFilter('all')
      }
    })
  }, [setFilter])
  return (
    <ul className="filters">
      <li>
        <a href="#/" className={filter === 'all' ? 'selected' : ''}>
          All
        </a>
      </li>
      <li>
        <a href="#/active" className={filter === 'active' ? 'selected' : ''}>
          Active
        </a>
      </li>
      <li>
        <a
          href="#/completed"
          className={filter === 'completed' ? 'selected' : ''}
        >
          Completed
        </a>
      </li>
    </ul>
  )
}

const todoListAtom = localStorageAtom<TodoListAtomType>(
  {
    filter: 'all',
    todos: [
      { task: 'Handle the dragon', checked: false },
      { task: 'Drink some water', checked: false },
    ],
  },
  'todos',
  TodoListTypeIO.is,
)

const App = () => {
  return (
    <div>
      <section className="todoapp">
        <TodoList todoListAtom={todoListAtom} />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
        <p>
          Created by <a href="http://blog.krawaller.se">David Waller</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
