import { localStorageAtom, focusAtom } from 'klyva'
import { TodoAppType } from './types'

const readFilterFromHash = () => {
  const hash = window.location.hash
  return hash === '#/active'
    ? 'active'
    : hash === '#/completed'
    ? 'completed'
    : 'all'
}

export const makeTodoAppAtom = () => {
  const todoAppAtom = localStorageAtom<TodoAppType>(
    {
      filter: readFilterFromHash(),
      todos: [
        { task: 'Handle the dragon', checked: false },
        { task: 'Drink some water', checked: false },
      ],
    },
    'todos',
    // Dummy verifier of stored value. In prod would likely use generated types and verifiers
    // using something like 'io-ts'
    (val: unknown): val is TodoAppType => val !== null,
  )
  const filterAtom = focusAtom(todoAppAtom, optic => optic.prop('filter'))
  window.addEventListener('hashchange', () => {
    filterAtom.update(readFilterFromHash())
  })
  return todoAppAtom
}
