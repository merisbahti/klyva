import { Atom } from 'klyva'
import * as React from 'react'
import { Filter, Todo } from '../../types'
import { makeTodoListAtom, makeFilterAtom } from '../data'
import { FilterAtomContext, TodoListAtomContext } from './contexts'

/*
This is a convencience compontent that provides all the needed data context.
By default it will use the "production atoms" as expected by TodoMVC, but
you can also pass in custom atoms which is convenient in testing scenario.
*/

type DataProps = {
  filterAtom?: Atom<Filter>
  todoListAtom?: Atom<Todo[]>
  children: React.ReactNode
}

export const DataProvider: React.FunctionComponent<DataProps> = props => {
  const {
    filterAtom = makeFilterAtom(),
    todoListAtom = makeTodoListAtom(),
    children,
  } = props
  return (
    <TodoListAtomContext.Provider value={todoListAtom}>
      <FilterAtomContext.Provider value={filterAtom}>
        {children}
      </FilterAtomContext.Provider>
    </TodoListAtomContext.Provider>
  )
}
