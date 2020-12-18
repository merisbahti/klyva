import * as React from 'react'
import { Todo, Filter } from '../types'
import { useAtomSlice, useSelector } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'
import { TodoItem } from './TodoItem'

type TodoListProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
  filterAtom: PrimitiveAtom<Filter>
}

export const TodoList = ({ todoListAtom, filterAtom }: TodoListProps) => {
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
