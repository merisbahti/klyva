import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initialState from './initialState'
import {
  atom,
  Atom,
  focusAtom,
  useAtom,
  useAtomSlice,
  useSelector,
} from '../../../src'
import './styles.css'

type NodeAtom = Atom<typeof initialState[number]>
type NodesAtom = Atom<typeof initialState>

const CurrentItemSideBar = ({
  nodesAtom,
  selectedIndexAtom,
}: {
  nodesAtom: NodesAtom
  selectedIndexAtom: Atom<number | null>
}) => {
  const nodeAtoms = useAtomSlice(nodesAtom)
  return (
    <div style={{ width: '100' }}>
      {nodeAtoms.map((nodeAtom, index) => (
        <NodeListItem
          key={index}
          nodeAtom={nodeAtom}
          isSelectedAtom={createIsSelectedAtom(selectedIndexAtom, index)}
        />
      ))}
    </div>
  )
}

const NodeList = ({
  nodesAtom,
  selectedIndexAtom,
}: {
  nodesAtom: NodesAtom
  selectedIndexAtom: Atom<number | null>
}) => {
  const nodeAtoms = useAtomSlice(nodesAtom)
  return (
    <div style={{ width: '100', background: '#bcbcbc' }}>
      {nodeAtoms.map((nodeAtom, index) => (
        <NodeListItem
          key={index}
          nodeAtom={nodeAtom}
          isSelectedAtom={createIsSelectedAtom(selectedIndexAtom, index)}
        />
      ))}
    </div>
  )
}

const NodeListItem = ({
  nodeAtom,
  isSelectedAtom,
}: {
  nodeAtom: NodeAtom
  isSelectedAtom: Atom<boolean>
}) => {
  const { x, y, name } = useSelector(
    focusAtom(nodeAtom, o => o.pick(['x', 'y', 'name'])),
  )
  const isSelected = useSelector(isSelectedAtom)
  return (
    <li style={{ backgroundColor: isSelected ? '#89CFF0' : undefined }}>
      <div>
        <b>{name}</b>
      </div>
      <div>
        (x = {x}, y = {y})
      </div>
    </li>
  )
}

const Canvas = ({
  nodesAtom,
  selectedIndexAtom,
}: {
  nodesAtom: NodesAtom
  selectedIndexAtom: Atom<number | null>
}) => {
  const nodeAtoms = useAtomSlice(nodesAtom)
  return (
    <>
      {nodeAtoms.map((x, index) => (
        <Node
          key={index}
          nodeAtom={x}
          isSelectedAtom={createIsSelectedAtom(selectedIndexAtom, index)}
        />
      ))}
    </>
  )
}

const Node = ({
  nodeAtom,
  isSelectedAtom,
}: {
  nodeAtom: NodeAtom
  isSelectedAtom: Atom<boolean>
}) => {
  const [xy, setXY] = useAtom(focusAtom(nodeAtom, o => o.pick(['x', 'y'])))
  const backgroundColor = useSelector(
    focusAtom(nodeAtom, o => o.prop('backgroundColor')),
  )
  const [selected, setSelected] = useAtom(isSelectedAtom)
  const [isMoving, setIsMoving] = React.useState(false)
  return (
    <div
      onClick={() => setSelected(v => !v)}
      onMouseDown={() => setIsMoving(true)}
      onMouseUp={() => setIsMoving(false)}
      onMouseLeave={() => setIsMoving(false)}
      onMouseMove={e => {
        if (isMoving) {
          setXY(oldXY => ({
            x: Math.max(0, oldXY.x + e.movementX),
            y: Math.max(0, oldXY.y + e.movementY),
          }))
        }
      }}
      style={{
        position: 'relative',
        height: 300,
        width: 300,
        left: xy.x,
        top: xy.y,
        backgroundColor: backgroundColor,
        border: selected ? '2px dashed #89CFF0' : undefined,
        boxSizing: 'border-box',
      }}
    ></div>
  )
}

const App = () => {
  const [nodesAtom] = React.useState(() => atom(initialState))
  const [selectedIndexAtom] = React.useState(() => atom<number | null>(null))
  return (
    <div style={{ display: 'flex' }}>
      <NodeList nodesAtom={nodesAtom} selectedIndexAtom={selectedIndexAtom} />
      <Canvas nodesAtom={nodesAtom} selectedIndexAtom={selectedIndexAtom} />
    </div>
  )
}

const createIsSelectedAtom = (
  selectedIndexAtom: Atom<null | number>,
  index: number,
) =>
  atom(
    get => get(selectedIndexAtom) === index,
    updater => {
      selectedIndexAtom.update(selectedIndex => {
        const currentValue = selectedIndex === index
        const newValue =
          typeof updater === 'function' ? updater(currentValue) : updater
        if (newValue) {
          return index
        } else {
          return null
        }
      })
    },
  )

ReactDOM.render(<App />, document.getElementById('root'))
