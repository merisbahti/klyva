import * as React from 'react'
import { TextInput } from './TextInput'
import { AtomCheckBox } from './AtomCheckBox'
import { TodoType } from '../types'
import { focusAtom } from 'klyva'
import { RemovableAtom } from 'klyva/dist/types'

type TodoItemProps = {
  todoAtom: RemovableAtom<TodoType, any>
}

export const TodoItem = ({ todoAtom }: TodoItemProps) => {
  const checkedAtom = focusAtom(todoAtom, optic => optic.prop('checked'))
  const textAtom = focusAtom(todoAtom, optic => optic.prop('task'))
  return (
    <>
      <AtomCheckBox checkedAtom={checkedAtom} />
      <TextInput textAtom={textAtom} />
      <button onClick={todoAtom.remove}>X</button>
    </>
  )
}
