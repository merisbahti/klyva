import * as React from 'react'
import { useAtomSlice, useSelector } from 'klyva'
import { TodoItem } from './TodoItem'
import { FilterAtomContext } from '../../../filterAtom'
import { TodoListAtomContext } from '../../../todoListAtom'

export const TodoList = () => {
  const filterAtom = React.useContext(FilterAtomContext)
  const todoListAtom = React.useContext(TodoListAtomContext)
  const filter = useSelector(filterAtom)
  const visibleTodosAtom = useAtomSlice(
    todoListAtom,
    ({ checked }) =>
      filter === 'all' ||
      (filter === 'completed' && checked) ||
      (filter === 'active' && !checked),
  )
  return (
    <ul className="todo-list">
      {visibleTodosAtom.map((todoAtom, index) => (
        <TodoItem key={filter + index} todoAtom={todoAtom} />
      ))}
    </ul>
  )
}
