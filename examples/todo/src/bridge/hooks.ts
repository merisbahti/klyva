import { useSelector } from 'klyva'
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
