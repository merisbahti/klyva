import * as React from 'react'
import { AtomCheckBox } from '../../../../common/AtomCheckBox'
import { Todo } from '../../../../../types'
import { focusAtom, useSelector } from 'klyva'
import { PrimitiveRemovableAtom, PrimitiveAtom } from 'klyva/dist/types'

type TodoItemViewProps = {
  todoAtom: PrimitiveRemovableAtom<Todo>
  editingAtom: PrimitiveAtom<boolean>
}

export const TodoItemView = ({ todoAtom, editingAtom }: TodoItemViewProps) => {
  const checkedAtom = focusAtom(todoAtom, optic => optic.prop('checked'))
  const text = useSelector(todoAtom, todo => todo.task)
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
