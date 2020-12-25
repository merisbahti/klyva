import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StaticFooter, TodoApp } from './ui'
import {
  FilterAtomContext,
  makeFilterAtom,
  makeTodoListAtom,
  TodoListAtomContext,
} from './data'

const Main = () => {
  const todoListAtom = makeTodoListAtom()
  const filterAtom = makeFilterAtom()
  return (
    <div>
      <TodoListAtomContext.Provider value={todoListAtom}>
        <FilterAtomContext.Provider value={filterAtom}>
          <TodoApp />
        </FilterAtomContext.Provider>
      </TodoListAtomContext.Provider>
      <StaticFooter />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
