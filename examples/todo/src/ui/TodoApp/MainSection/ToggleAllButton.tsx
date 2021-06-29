import * as React from 'react'
import { useSelector } from 'klyva'
import { useTodoListAtom } from '../../../bridge'

export const ToggleAllButton = () => {
  const todoListAtom = useTodoListAtom()
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
