import * as React from 'react'
import { PrimitiveAtom } from 'klyva/dist/types'
import { Filter, Todo } from '../../types'
import { RemainingIndicator } from './RemainingIndicator'
import { ClearCompletedButton } from './ClearCompletedButton'
import { FilterSelector } from './FilterSelector'

type AppFooterProps = {
  todoListAtom: PrimitiveAtom<Todo[]>
  filterAtom: PrimitiveAtom<Filter>
}

export const AppFooter = ({ todoListAtom, filterAtom }: AppFooterProps) => {
  return (
    <footer className="footer">
      <RemainingIndicator todoListAtom={todoListAtom} />
      <FilterSelector filterAtom={filterAtom} />
      <ClearCompletedButton todoListAtom={todoListAtom} />
    </footer>
  )
}
