import * as React from 'react'
import { useAtomSlice } from 'klyva'
import { TodoItem } from './TodoItem'
import { useFilterValue, useTodoListAtom } from '../../../../bridge'

export const TodoList = () => {
  const filter = useFilterValue()
  const todoListAtom = useTodoListAtom()
  const visibleTodoAtoms = useAtomSlice(
    todoListAtom,
    ({ checked }) =>
      filter === 'all' ||
      (filter === 'completed' && checked) ||
      (filter === 'active' && !checked),
  )
  return (
    <ul className="todo-list">
      {visibleTodoAtoms.map((todoAtom, index) => (
        <TodoItem key={filter + index} todoAtom={todoAtom} />
      ))}
    </ul>
  )
}
