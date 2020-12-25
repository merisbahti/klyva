import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StaticFooter } from './components/StaticFooter'
import { TodoApp } from './components/TodoApp'
import { FilterAtomContext, makeFilterAtom } from './filterAtom'
import { makeTodoListAtom, TodoListAtomContext } from './todoListAtom'

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
