import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StaticFooter } from './components/StaticFooter'
import { TodoApp } from './components/TodoApp'
import { makeFilterAtom } from './makeFilterAtom'
import { makeTodoListAtom } from './makeTodoListAtom'

const Main = () => {
  const todoListAtom = makeTodoListAtom()
  const filterAtom = makeFilterAtom()
  return (
    <div>
      <TodoApp todoListAtom={todoListAtom} filterAtom={filterAtom} />
      <StaticFooter />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
