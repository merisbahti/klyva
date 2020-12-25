import * as React from 'react'
import { RemainingIndicator } from './RemainingIndicator'
import { ClearCompletedButton } from './ClearCompletedButton'
import { FilterSelector } from './FilterSelector'

export const AppFooter = () => {
  return (
    <footer className="footer">
      <RemainingIndicator />
      <FilterSelector />
      <ClearCompletedButton />
    </footer>
  )
}
