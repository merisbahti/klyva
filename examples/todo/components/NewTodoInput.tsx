import * as React from 'react'
import { TodoType } from '../types'
import { PrimitiveAtom } from '../../../src/types'

type NewTodoInputProps = {
  todosAtom: PrimitiveAtom<TodoType[]>
}

export const NewTodoInput = ({ todosAtom }: NewTodoInputProps) => {
  const [newTodo, setNewTodo] = React.useState('')
  return (
    <input
      className="new-todo"
      value={newTodo}
      placeholder="What needs to be done?"
      onKeyUp={e => {
        if (e.key === 'Enter') {
          todosAtom.update(todos => [
            { task: newTodo, checked: false },
            ...todos,
          ])
          setNewTodo('')
        }
      }}
      onChange={event => {
        setNewTodo(event.target.value)
      }}
    />
  )
}
