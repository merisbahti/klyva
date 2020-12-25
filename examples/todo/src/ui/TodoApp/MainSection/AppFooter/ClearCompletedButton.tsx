import * as React from 'react'
import { TodoListAtomContext } from '../../../../data'

export const ClearCompletedButton = () => {
  const todoListAtom = React.useContext(TodoListAtomContext)
  const handleClear = React.useCallback(() => {
    todoListAtom.update(todos => todos.filter(todo => !todo.checked))
  }, [todoListAtom])
  return (
    <button onClick={handleClear} className="clear-completed">
      Clear completed
    </button>
  )
}
