import * as React from 'react'
import * as ReactDOM from 'react-dom'
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

ReactDOM.render(<Main />, document.getElementById('root'))
