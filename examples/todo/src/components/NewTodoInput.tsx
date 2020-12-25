import * as React from 'react'
import { Todo } from '../../types'
import { PrimitiveAtom } from 'klyva/dist/types'
import { SmartTextInput } from '../common/SmartTextInput'

type NewTodoInputProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
}

export const NewTodoInput = ({ todoListAtom }: NewTodoInputProps) => {
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
