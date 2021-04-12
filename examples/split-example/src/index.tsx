import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initialState from './initialState'
import { atom, Atom, focusAtom, useAtom, useAtomSlice } from '../../../src'
import './styles.css'

type NodeAtom = Atom<typeof initialState[number]>
type NodesAtom = Atom<typeof initialState>

const Canvas = ({ nodesAtom }: { nodesAtom: NodesAtom }) => {
  const nodeAtoms = useAtomSlice(nodesAtom)
  return (
    <>
      {nodeAtoms.map(x => (
        <Node nodeAtom={x} />
      ))}
    </>
  )
}

const Node = ({ nodeAtom }: { nodeAtom: NodeAtom }) => {
  const [x, setX] = useAtom(focusAtom(nodeAtom, o => o.prop('x')))
  const [y, setY] = useAtom(focusAtom(nodeAtom, o => o.prop('y')))
  return <div style={{ position: 'relative', height: 300, width: 300 }}></div>
}

const App = () => {
  const [nodesAtom] = React.useState(() => atom(initialState))
  return (
    <>
      <Canvas nodesAtom={nodesAtom} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
