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
  useDeprismify,
} from '../../../src'
import './styles.css'

type NodeAtom = Atom<typeof initialState[number]>
type NodesAtom = Atom<typeof initialState>

const CurrentItemSideBar = ({
  nodesAtom,
  selectedIndexAtom,

  backgroundColorAtom,
}: {
  nodesAtom: Atom<typeof initialState>
  selectedIndexAtom: Atom<number | null>
  backgroundColorAtom: Atom<string>
}) => {
  const selectedIndex = useSelector(selectedIndexAtom)
  const selectedAtom = useDeprismify(
    focusAtom(nodesAtom, o =>
      o.at(selectedIndex !== null ? selectedIndex : -1),
    ),
  )
  const [backgroundColor, setBackgroundColor] = useAtom(backgroundColorAtom)

  return (
    <div
      style={{
        width: '300px',
        padding: '8px',
        backgroundColor: '#cacaca',
        borderLeft: '2px solid #9c9c9c',
      }}
    >
      <h2>Document:</h2>
      <div>
        Background color:{' '}
        <input
          type="color"
          value={backgroundColor}
          onChange={e => setBackgroundColor(e.target.value)}
        />
      </div>
      {selectedAtom ? (
        <NodeSettings nodeAtom={selectedAtom} />
      ) : (
        'Select an item.'
      )}
    </div>
  )
}

const NodeSettings = ({
  nodeAtom,
}: {
  nodeAtom: Atom<typeof initialState[number]>
}) => {
  const [name, setName] = useAtom(focusAtom(nodeAtom, o => o.prop('name')))
  const [x, setX] = useAtom(focusAtom(nodeAtom, o => o.prop('x')))
  const [y, setY] = useAtom(focusAtom(nodeAtom, o => o.prop('y')))
  return (
    <div style={{ width: '100' }}>
      <div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          value={x}
          onChange={e => setX(Number(e.target.value))}
        />
      </div>
      <div>
        <input
          type="number"
          value={y}
          onChange={e => setY(Number(e.target.value))}
        />
      </div>
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
    <div
      style={{
        minWidth: '200px',
        maxWidth: '200px',
        backgroundColor: '#cacaca',
        borderRight: '2px solid #9c9c9c',
      }}
    >
      <button
        onClick={() =>
          nodesAtom.update(oldValue => [
            ...oldValue,
            { x: 0, y: 0, name: 'New value', backgroundColor: '#fafafa' },
          ])
        }
      >
        +
      </button>
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
  const [isSelected, setIsSelected] = useAtom(isSelectedAtom)
  return (
    <div
      onClick={() => setIsSelected(v => !v)}
      style={{
        backgroundColor: isSelected ? '#89CFF0' : undefined,
        cursor: 'pointer',
      }}
    >
      <div>
        <b>{name}</b>
      </div>
      <div>
        (x = {x}, y = {y})
      </div>
    </div>
  )
}

const Canvas = ({
  nodesAtom,
  selectedIndexAtom,
  backgroundColorAtom,
}: {
  nodesAtom: NodesAtom
  selectedIndexAtom: Atom<number | null>
  backgroundColorAtom: Atom<string>
}) => {
  const nodeAtoms = useAtomSlice(nodesAtom)
  const backgroundColor = useSelector(backgroundColorAtom)
  return (
    <div style={{ backgroundColor, width: '100%' }}>
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        {nodeAtoms.map((x, index) => (
          <Node
            key={index}
            nodeAtom={x}
            isSelectedAtom={createIsSelectedAtom(selectedIndexAtom, index)}
          />
        ))}
      </div>
    </div>
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
  const name = useSelector(nodeAtom, value => value.name)
  const [selected, setSelected] = useAtom(isSelectedAtom)
  const [isMoving, setIsMoving] = React.useState(false)
  return (
    <div
      onMouseDown={() => {
        setIsMoving(true)
        setSelected(true)
      }}
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
        position: 'absolute',
        height: 200,
        width: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'center',
        textAlign: 'center',
        left: xy.x,
        top: xy.y,
        backgroundColor: '#dcdcdc',
        border: selected ? '4px dashed #89CFF0' : undefined,
        boxSizing: 'border-box',
      }}
    >
      <span>{name}</span>
    </div>
  )
}

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
      <NodeList nodesAtom={nodesAtom} selectedIndexAtom={selectedIndexAtom} />
      <Canvas
        nodesAtom={nodesAtom}
        selectedIndexAtom={selectedIndexAtom}
        backgroundColorAtom={backgroundColorAtom}
      />
      <CurrentItemSideBar
        backgroundColorAtom={backgroundColorAtom}
        nodesAtom={nodesAtom}
        selectedIndexAtom={selectedIndexAtom}
      />
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
