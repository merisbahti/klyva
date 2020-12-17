import * as React from 'react'
import { TextInput } from './TextInput'
import { CheckBox } from './CheckBox'
import { TodoType } from '../types'
import { focusAtom } from '../../../src/index'
import { PrimitiveAtom } from '../../../src/types'

type TodoItemProps = {
  todoAtom: PrimitiveAtom<TodoType>
  onRemove: () => void
}

export const TodoItem = ({ todoAtom, onRemove }: TodoItemProps) => {
  const checkedAtom = focusAtom(todoAtom, optic => optic.prop('checked'))
  const textAtom = focusAtom(todoAtom, optic => optic.prop('task'))
  return (
    <>
      <CheckBox checkedAtom={checkedAtom} />
      <TextInput textAtom={textAtom} />
      <button onClick={onRemove}>X</button>
    </>
  )
}
