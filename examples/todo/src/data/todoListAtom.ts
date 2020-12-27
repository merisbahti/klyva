import { localStorageAtom } from 'klyva'
import { Todo } from '../../types'

export const initialTodos: Todo[] = [
  { task: 'Handle the dragon', checked: false },
  { task: 'Drink some water', checked: false },
]

// Create the atom to be used in the TodoMVC app
export const makeTodoListAtom = () => {
  // a localStorageAtom automatically reads from and stores to localStorage,
  // preserving the app state between sessions
  const todoListAtom = localStorageAtom(initialTodos, 'klyva-todomvc')
  return todoListAtom
}
