import * as React from 'react'
import { FilterType } from '../types'
import { PrimitiveAtom } from '../../../src/types'
import { useAtom } from '../../../src/react-utils'

type FilterProps = { filterAtom: PrimitiveAtom<FilterType> }

export const Filter = ({ filterAtom }: FilterProps) => {
  const [filter, setFilter] = useAtom(filterAtom)
  React.useEffect(() => {
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash
      if (newHash === '#/active') {
        setFilter('active')
      } else if (newHash === '#/completed') {
        setFilter('completed')
      } else {
        setFilter('all')
      }
    })
  }, [setFilter])
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
