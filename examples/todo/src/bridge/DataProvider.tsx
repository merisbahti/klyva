import * as React from 'react'
import { PrimitiveAtom } from 'klyva/dist/types'
import { Filter, Todo } from '../../types'
import { makeTodoListAtom, makeFilterAtom } from '../data'
import { FilterAtomContext, TodoListAtomContext } from './contexts'

/*
This is a convencience compontent that provides all the needed data context.
By default it will use the "production atoms" as expected by TodoMVC, but
you can also pass in custom atoms which is convenient in testing scenario.
*/

type DataProps = {
  filterAtom?: PrimitiveAtom<Filter>
  todoListAtom?: PrimitiveAtom<Todo[]>
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
