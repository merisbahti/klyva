import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StaticFooter } from './components/StaticFooter'
import { TodoApp } from './components/TodoApp'
import { makeTodoAppAtom } from './makeTodoAppAtom'

const Main = () => {
  const todoAppAtom = makeTodoAppAtom()
  return (
    <div>
      <TodoApp todoAppAtom={todoAppAtom} />
      <StaticFooter />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
