import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { localStorageAtom } from 'klyva'
import { TodoAppType, TodoAppTypeIO } from './types'
import { StaticFooter } from './components/StaticFooter'
import { TodoApp } from './components/TodoApp'

import 'todomvc-app-css/index.css'

const Main = () => {
  const todoAppAtom = localStorageAtom<TodoAppType>(
    {
      filter: 'all',
      todos: [
        { task: 'Handle the dragon', checked: false },
        { task: 'Drink some water', checked: false },
      ],
    },
    'todos',
    TodoAppTypeIO.is,
  )
  return (
    <div>
      <TodoApp todoAppAtom={todoAppAtom} />
      <StaticFooter />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
