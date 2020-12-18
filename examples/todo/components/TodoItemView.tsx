import * as React from 'react'
import { AtomCheckBox } from './AtomCheckBox'
import { Todo } from '../types'
import { focusAtom, useSelector } from 'klyva'
import { RemovableAtom, PrimitiveAtom } from 'klyva/dist/types'

type TodoItemViewProps = {
  todoAtom: RemovableAtom<Todo, any>
  editingAtom: PrimitiveAtom<boolean>
}

export const TodoItemView = ({ todoAtom, editingAtom }: TodoItemViewProps) => {
  const checkedAtom = focusAtom(todoAtom, optic => optic.prop('checked'))
  const textAtom = focusAtom(todoAtom, optic => optic.prop('task'))
  const text = useSelector(textAtom)
  const handleStartEdit = React.useCallback(() => editingAtom.update(true), [
    editingAtom,
  ])
  return (
    <div className="view">
      <AtomCheckBox boolAtom={checkedAtom} className="toggle" />
      <label onDoubleClick={handleStartEdit}>{text}</label>
      <button className="destroy" onClick={todoAtom.remove}></button>
    </div>
  )
}
