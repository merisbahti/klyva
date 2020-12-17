import * as React from 'react'
import { focusAtom } from '../../../src/index'
import { PrimitiveAtom } from '../../../src/types'
import { TodoAppType } from '../types'
import { RemainingIndicator } from './RemainingIndicator'
import { ToggleAllButton } from './ToggleAllButton'
import { ClearCompletedButton } from './ClearCompletedButton'
import { NewTodoInput } from './NewTodoInput'
import { Filter } from './Filter'
import { TodoList } from './TodoList'

type TodoAppProps = {
  todoAppAtom: PrimitiveAtom<TodoAppType>
}

export const TodoApp = ({ todoAppAtom }: TodoAppProps) => {
  const todosAtom = focusAtom(todoAppAtom, optic => optic.prop('todos'))
  const filterAtom = focusAtom(todoAppAtom, optic => optic.prop('filter'))
  return (
    <section className="todoapp">
      <header className="header">
        <h1>Todos</h1>
        <NewTodoInput todosAtom={todosAtom} />
      </header>
      <section className="main">
        <ToggleAllButton todosAtom={todosAtom} />
        <TodoList todoAppAtom={todoAppAtom} />
        <footer className="footer">
          <RemainingIndicator todosAtom={todosAtom} />
          <Filter filterAtom={filterAtom} />
          <ClearCompletedButton todosAtom={todosAtom} />
        </footer>
      </section>
    </section>
  )
}
