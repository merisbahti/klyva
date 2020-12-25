import * as React from 'react'
import { ToggleAllButton } from './ToggleAllButton'
import { TodoList } from './TodoList'
import { AppFooter } from './AppFooter'

export const MainSection = () => {
  return (
    <section className="main">
      <ToggleAllButton />
      <TodoList />
      <AppFooter />
    </section>
  )
}
