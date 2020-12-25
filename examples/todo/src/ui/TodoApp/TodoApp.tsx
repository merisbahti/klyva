import * as React from 'react'
import { HeaderSection } from './HeaderSection'
import { MainSection } from './MainSection'

export const TodoApp = () => {
  return (
    <section className="todoapp">
      <HeaderSection />
      <MainSection />
    </section>
  )
}
