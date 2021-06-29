import { atom } from 'klyva'
import { createContext } from 'react'
import { Filter, Todo } from '../../types'

export const FilterAtomContext = createContext(atom<Filter>('all'))

export const TodoListAtomContext = createContext(atom<Todo[]>([]))
