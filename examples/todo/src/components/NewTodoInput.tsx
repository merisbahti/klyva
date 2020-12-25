import * as React from 'react'
import { SmartTextInput } from '../common/SmartTextInput'
import { TodoListAtomContext } from '../todoListAtom'

export const NewTodoInput = () => {
  const todoListAtom = React.useContext(TodoListAtomContext)
  const handleSubmit = React.useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      const elem = (evt.target as unknown) as HTMLInputElement
      todoListAtom.update(todos => [
        { task: elem.value, checked: false },
        ...todos,
      ])
      elem.value = ''
    },
    [todoListAtom],
  )
  return (
    <SmartTextInput
      autoFocus
      className="new-todo"
      defaultValue=""
      placeholder="What needs to be done?"
      onEnter={handleSubmit}
    />
  )
}
