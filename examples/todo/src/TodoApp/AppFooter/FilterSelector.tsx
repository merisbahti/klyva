import * as React from 'react'
import { useSelector } from 'klyva'
import { FilterAtomContext } from '../../filterAtom'

export const FilterSelector = () => {
  const filterAtom = React.useContext(FilterAtomContext)
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
