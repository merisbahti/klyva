import * as React from 'react'
import { TodoType } from '../types'
import { PrimitiveAtom } from 'klyva/dist/types'
import { useSelector } from 'klyva'

type ToggleAllButtonProps = {
  todosAtom: PrimitiveAtom<TodoType[]>
}

export const ToggleAllButton = ({ todosAtom }: ToggleAllButtonProps) => {
  const allDone = useSelector(
    todosAtom,
    todos => !todos.some((todo) => !todo.checked),
  )
  const handleToggle = React.useCallback(() => {
    todosAtom.update(todos =>
      todos.map(todo => ({
        ...todo,
        checked: !allDone,
      })),
    )
  }, [todosAtom, allDone])
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
