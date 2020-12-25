import * as React from 'react'
import { ToggleAllButton } from './ToggleAllButton'
import { NewTodoInput } from './NewTodoInput'
import { TodoList } from './TodoList/'
import { AppFooter } from './AppFooter/'

export const TodoApp = () => {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTodoInput />
      </header>
      <section className="main">
        <ToggleAllButton />
        <TodoList />
        <AppFooter />
      </section>
    </section>
  )
}
