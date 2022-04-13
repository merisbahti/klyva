import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { StaticFooter, TodoApp } from './ui'
import { DataProvider } from './bridge'

const Main = () => (
  <>
    <DataProvider>
      <TodoApp />
    </DataProvider>
    <StaticFooter />
  </>
)
const element = document.getElementById('root')
if (element) createRoot(element).render(<Main />)
