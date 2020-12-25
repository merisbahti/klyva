import * as React from 'react'
import { Todo } from '../../types'
import { useSelector, atom } from 'klyva'
import { PrimitiveRemovableAtom } from 'klyva/dist/types'
import { TodoItemView } from './TodoItemView'
import { TodoItemForm } from './TodoItemForm'

type TodoItemProps = {
  todoAtom: PrimitiveRemovableAtom<Todo>
}

export const TodoItem = ({ todoAtom }: TodoItemProps) => {
  const completed = useSelector(todoAtom, todo => todo.checked)
  const editingAtom = React.useMemo(() => atom(false), [])
  const editing = useSelector(editingAtom)
  const cls = `${editing ? 'editing' : ''} ${completed ? 'completed' : ''}`
  return (
    <li className={cls}>
      <TodoItemView todoAtom={todoAtom} editingAtom={editingAtom} />
      <TodoItemForm todoAtom={todoAtom} editingAtom={editingAtom} />
    </li>
  )
}
