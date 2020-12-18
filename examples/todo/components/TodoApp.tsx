import * as React from 'react'
import { PrimitiveAtom } from 'klyva/dist/types'
import { Filter, Todo } from '../types'
import { RemainingIndicator } from './RemainingIndicator'
import { ToggleAllButton } from './ToggleAllButton'
import { ClearCompletedButton } from './ClearCompletedButton'
import { NewTodoInput } from './NewTodoInput'
import { FilterSelector } from './FilterSelector'
import { TodoList } from './TodoList'

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
        <footer className="footer">
          <RemainingIndicator todoListAtom={todoListAtom} />
          <FilterSelector filterAtom={filterAtom} />
          <ClearCompletedButton todoListAtom={todoListAtom} />
        </footer>
      </section>
    </section>
  )
}
