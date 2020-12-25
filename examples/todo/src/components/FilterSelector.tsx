import * as React from 'react'
import { Filter } from '../../types'
import { PrimitiveAtom } from 'klyva/dist/types'
import { useSelector } from 'klyva'

type FilterSelectorProps = { filterAtom: PrimitiveAtom<Filter> }

export const FilterSelector = ({ filterAtom }: FilterSelectorProps) => {
  const filter = useSelector(filterAtom)
  return (
    <ul className="filters">
      <li>
        <a href="#/" className={filter === 'all' ? 'selected' : ''}>
          All
        </a>
      </li>
      <li>
        <a href="#/active" className={filter === 'active' ? 'selected' : ''}>
          Active
        </a>
      </li>
      <li>
        <a
          href="#/completed"
          className={filter === 'completed' ? 'selected' : ''}
        >
          Completed
        </a>
      </li>
    </ul>
  )
}
