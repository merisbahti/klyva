import * as React from 'react'
import { Todo } from '../types'
import { PrimitiveAtom } from 'klyva/dist/types'
import { useSelector } from 'klyva'

type RemainingIndicatorProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
}

export const RemainingIndicator = ({
  todoListAtom,
}: RemainingIndicatorProps) => {
  const count = useSelector(
    todoListAtom,
    todos => todos.filter(todo => !todo.checked).length,
  )
  return (
    <span className="todo-count">
      <strong>{count}</strong> item{count === 1 ? '' : 's'} left
    </span>
  )
}
