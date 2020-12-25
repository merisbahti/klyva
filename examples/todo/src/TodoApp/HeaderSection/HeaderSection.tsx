import * as React from 'react'
import { NewTodoInput } from './NewTodoInput'

export const HeaderSection = () => {
  return (
    <header className="header">
      <h1>todos</h1>
      <NewTodoInput />
    </header>
  )
}
