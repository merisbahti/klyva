import * as React from 'react'
import { Todo } from '../../types'
import { PrimitiveAtom } from 'klyva/dist/types'
import { useSelector } from 'klyva'

type ToggleAllButtonProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
}

export const ToggleAllButton = ({ todoListAtom }: ToggleAllButtonProps) => {
  const allDone = useSelector(
    todoListAtom,
    todos => !todos.some(todo => !todo.checked),
  )
  const handleToggle = React.useCallback(() => {
    todoListAtom.update(todos =>
      todos.map(todo => ({
        ...todo,
        checked: !allDone,
      })),
    )
  }, [todoListAtom, allDone])
  return (
    <>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allDone}
        readOnly
      />
      <label onClick={handleToggle} htmlFor="toggle-all">
        Mark all as complete
      </label>
    </>
  )
}
