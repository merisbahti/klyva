import * as React from 'react'
import { AtomCheckBox } from './AtomCheckBox'
import { TodoType } from '../types'
import { focusAtom, useSelector } from 'klyva'
import { RemovableAtom } from 'klyva/dist/types'

type TodoItemProps = {
  todoAtom: RemovableAtom<TodoType, any>
}

export const TodoItem = ({ todoAtom }: TodoItemProps) => {
  const checkedAtom = focusAtom(todoAtom, optic => optic.prop('checked'))
  const textAtom = focusAtom(todoAtom, optic => optic.prop('task'))
  const text = useSelector(textAtom)
  const cls = useSelector(checkedAtom, chk => (chk ? 'completed' : ''))
  return (
    <li className={cls}>
      <AtomCheckBox boolAtom={checkedAtom} className="toggle" />
      <label>{text}</label>
      {/* <TextInput textAtom={textAtom} /> */}
      <button className="destroy" onClick={todoAtom.remove}></button>
    </li>
  )
}
