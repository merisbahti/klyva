import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initialState from './initialState'
import { atom } from '../../../src'
import './styles.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css/normalize.css'
import Settings from './settings'
import NodeList from './node-list'
import Canvas from './canvas'

const App = () => {
  const [nodesAtom] = React.useState(() => atom(initialState))
  const [backgroundColorAtom] = React.useState(() => atom('#fff'))
  const [selectedIndexAtom] = React.useState(() => atom<number | null>(null))
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: '300px',
          padding: '8px',
          backgroundColor: '#cacaca',
          borderRight: '2px solid #9c9c9c',
        }}
      >
        <NodeList nodesAtom={nodesAtom} selectedIndexAtom={selectedIndexAtom} />
      </div>
      <Canvas
        nodesAtom={nodesAtom}
        selectedIndexAtom={selectedIndexAtom}
        backgroundColorAtom={backgroundColorAtom}
      />

      <div
        style={{
          width: '300px',
          padding: '8px',
          backgroundColor: '#cacaca',
          borderLeft: '2px solid #9c9c9c',
        }}
      >
        <Settings
          backgroundColorAtom={backgroundColorAtom}
          nodesAtom={nodesAtom}
          selectedIndexAtom={selectedIndexAtom}
        />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
