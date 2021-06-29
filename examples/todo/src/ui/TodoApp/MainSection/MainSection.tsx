import * as React from 'react'
import { ToggleAllButton } from './ToggleAllButton'
import { TodoList } from './TodoList'

export const MainSection = () => {
  return (
    <section className="main">
      <ToggleAllButton />
      <TodoList />
    </section>
  )
}
