import * as React from 'react'
import { TodoItem } from './TodoItem'
import { useVisibleTodoAtoms } from '../../../../bridge'

export const TodoList = () => {
  const visibleTodoAtoms = useVisibleTodoAtoms()
  return (
    <ul className="todo-list">
      {visibleTodoAtoms.map((todoAtom, index) => (
        <TodoItem key={index} todoAtom={todoAtom} />
      ))}
    </ul>
  )
}
