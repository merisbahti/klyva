import * as React from 'react'
import { TodoType } from '../types'
import { PrimitiveAtom } from '../../../src/types'

type ClearCompletedButtonProps = {
  todosAtom: PrimitiveAtom<TodoType[]>
}

export const ClearCompletedButton = ({
  todosAtom,
}: ClearCompletedButtonProps) => {
  const handleClear = React.useCallback(() => {
    todosAtom.update(todos => todos.filter(todo => !todo.checked))
  }, [todosAtom])
  return (
    <button onClick={handleClear} className="clear-completed">
      Clear completed
    </button>
  )
}
