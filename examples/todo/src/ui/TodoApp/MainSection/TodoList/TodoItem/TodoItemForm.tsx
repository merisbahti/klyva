import * as React from 'react'
import { Todo } from '../../../../../../types'
import { focusAtom, useSelector } from 'klyva'
import { PrimitiveRemovableAtom, PrimitiveAtom } from 'klyva/dist/types'
import { SmartTextInput } from '../../../../common'

type TodoItemFormProps = {
  todoAtom: PrimitiveRemovableAtom<Todo>
  editingAtom: PrimitiveAtom<boolean>
}

export const TodoItemForm = ({ todoAtom, editingAtom }: TodoItemFormProps) => {
  const textAtom = focusAtom(todoAtom, optic => optic.prop('task'))
  const text = useSelector(textAtom)
  const editing = useSelector(editingAtom)
  const handleSubmit = React.useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      const elem = (evt.target as unknown) as HTMLInputElement
      textAtom.update(elem.value)
      editingAtom.update(false)
      elem.value = ''
    },
    [textAtom, editingAtom],
  )
  const handleBlur = React.useCallback(() => editingAtom.update(false), [
    editingAtom,
  ])
  // Normally we could always render this, and TodoMVC CSS would take care of showing/hiding.
  // But by only rendering on edit we leverage `autoFocus` and `defaultValue`
  return editing ? (
    <SmartTextInput
      autoFocus
      className="edit"
      defaultValue={text}
      onEnter={handleSubmit}
      onBlur={handleBlur}
    />
  ) : null
}
