import * as React from 'react'
import { TodoAppType } from '../types'
import { focusAtom, useAtomSlice, useSelector } from '../../../src/index'
import { PrimitiveAtom } from '../../../src/types'
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
    <ul>
      {visibleTodosAtom.map((todoAtom, index) => (
        <li key={index}>
          <TodoItem
            key={index}
            todoAtom={todoAtom}
            onRemove={todoAtom.remove}
          />
        </li>
      ))}
    </ul>
  )
}