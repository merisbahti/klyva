import * as React from 'react'
import { useSelector } from 'klyva'
import { useTodoListAtom } from '../../../bridge'

export const RemainingIndicator = () => {
  const todoListAtom = useTodoListAtom()
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
