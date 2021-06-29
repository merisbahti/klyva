import * as React from 'react'
import { useFilterValue } from '../../../bridge'

export const FilterSelector = () => {
  const filter = useFilterValue()
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
