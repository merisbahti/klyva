import * as React from 'react'
import { TodoType } from '../types'
import { PrimitiveAtom } from '../../../src/types'
import { useSelector } from '../../../src/react-utils'

type RemainingIndicatorProps = {
  todosAtom: PrimitiveAtom<TodoType[]>
}

export const RemainingIndicator = ({ todosAtom }: RemainingIndicatorProps) => {
  const count = useSelector(
    todosAtom,
    todos => todos.filter((todo) => !todo.checked).length,
  )
  return (
    <span className="todo-count">
      <strong>{count}</strong> item{count === 1 ? '' : 's'} left
    </span>
  )
}