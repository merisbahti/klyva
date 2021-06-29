import { useAtomSlice, useSelector } from 'klyva'
import { useContext } from 'react'
import { FilterAtomContext, TodoListAtomContext } from './contexts'

export const useTodoListAtom = () => {
  return useContext(TodoListAtomContext)
}

export const useTodoListValue = () => {
  return useSelector(useTodoListAtom())
}

export const useFilterAtom = () => {
  return useContext(FilterAtomContext)
}

export const useFilterValue = () => {
  return useSelector(useFilterAtom())
}

export const useVisibleTodoAtoms = () => {
  const todoListAtom = useTodoListAtom()
  const filter = useFilterValue()
  return useAtomSlice(
    todoListAtom,
    ({ checked }) =>
      filter === 'all' ||
      (filter === 'completed' && checked) ||
      (filter === 'active' && !checked),
  )
}
