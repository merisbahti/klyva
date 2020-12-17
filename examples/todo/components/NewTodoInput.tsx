import * as React from 'react'
import { TodoType } from '../types'
import { PrimitiveAtom } from 'klyva/dist/types'
import { SmartTextInput } from './SmartTextInput'

type NewTodoInputProps = {
  todosAtom: PrimitiveAtom<TodoType[]>
}

export const NewTodoInput = ({ todosAtom }: NewTodoInputProps) => {
  const handleSubmit = React.useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      const elem = (evt.target as unknown) as HTMLInputElement
      todosAtom.update(todos => [
        { task: elem.value, checked: false },
        ...todos,
      ])
      elem.value = ''
    },
    [todosAtom],
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
