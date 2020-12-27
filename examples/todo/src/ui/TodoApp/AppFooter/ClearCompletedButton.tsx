import * as React from 'react'
import { useTodoListAtom } from '../../../bridge'

export const ClearCompletedButton = () => {
  const todoListAtom = useTodoListAtom()
  const handleClear = React.useCallback(() => {
    todoListAtom.update(todos => todos.filter(todo => !todo.checked))
  }, [todoListAtom])
  return (
    <button onClick={handleClear} className="clear-completed">
      Clear completed
    </button>
  )
}
