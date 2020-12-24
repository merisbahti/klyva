import * as React from 'react'
import { Todo } from '../types'
import { PrimitiveAtom } from 'klyva/dist/types'

type ClearCompletedButtonProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
}

export const ClearCompletedButton = ({
  todoListAtom,
}: ClearCompletedButtonProps) => {
  const handleClear = React.useCallback(() => {
    todoListAtom.update(todos => todos.filter(todo => !todo.checked))
  }, [todoListAtom])
  return (
    <button onClick={handleClear} className="clear-completed">
      Clear completed
    </button>
  )
}
