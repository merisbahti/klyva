import { localStorageAtom } from 'klyva'
import { createContext } from 'react'
import { Todo } from '../../types'

export const makeTodoListAtom = () => {
  // a localStorageAtom automatically reads from and stores to localStorage,
  // preserving the app state between sessions
  const todoListAtom = localStorageAtom<Todo[]>(
    [
      { task: 'Handle the dragon', checked: false },
      { task: 'Drink some water', checked: false },
    ],
    'klyva-todomvc',
  )
  return todoListAtom
}

export const TodoListAtomContext = createContext(makeTodoListAtom())
