import { localStorageAtom } from 'klyva'
import { Todo } from './types'

export const makeTodoListAtom = () => {
  // a localStorageAtom automatically reads from and stores to localStorage,
  // preserving the app state between sessions
  const todoListAtom = localStorageAtom<Todo[]>(
    [
      { task: 'Handle the dragon', checked: false },
      { task: 'Drink some water', checked: false },
    ],
    'todolist',
    // Dummy verifier of stored value. In prod would likely use generated types and verifiers
    // using something like 'io-ts'
    (val: unknown): val is Todo[] => val !== null,
  )
  return todoListAtom
}
