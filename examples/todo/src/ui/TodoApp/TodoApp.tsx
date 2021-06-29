import * as React from 'react'
import { AppFooter } from './AppFooter'
import { HeaderSection } from './HeaderSection'
import { MainSection } from './MainSection'

export const TodoApp = () => {
  return (
    <section className="todoapp">
      <HeaderSection />
      <MainSection />
      <AppFooter />
    </section>
  )
}
