import * as React from 'react'
import { PrimitiveAtom } from 'klyva/dist/types'
import { Filter, Todo } from '../../types'
import { ToggleAllButton } from './ToggleAllButton'
import { NewTodoInput } from './NewTodoInput'
import { TodoList } from './TodoList'
import { AppFooter } from './AppFooter'

type TodoAppProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
  filterAtom: PrimitiveAtom<Filter>
}

export const TodoApp = ({ todoListAtom, filterAtom }: TodoAppProps) => {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTodoInput todoListAtom={todoListAtom} />
      </header>
      <section className="main">
        <ToggleAllButton todoListAtom={todoListAtom} />
        <TodoList todoListAtom={todoListAtom} filterAtom={filterAtom} />
        <AppFooter todoListAtom={todoListAtom} filterAtom={filterAtom} />
      </section>
    </section>
  )
}
