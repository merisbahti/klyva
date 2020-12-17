import * as React from 'react'
import { TodoAppType } from '../types'
import { focusAtom, useAtomSlice, useSelector } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'
import { TodoItem } from './TodoItem'

type TodoListProps = {
  todoAppAtom: PrimitiveAtom<TodoAppType>
}

export const TodoList = ({ todoAppAtom }: TodoListProps) => {
  const todosAtom = focusAtom(todoAppAtom, optic => optic.prop('todos'))
  const filter = useSelector(todoAppAtom, value => value.filter)
  const visibleTodosAtom = useAtomSlice(
    todosAtom,
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
