import * as React from 'react'
import initialState from './initialState'
import {
  Atom,
  focusAtom,
  useAtom,
  useAtomSlice,
  useSelector,
} from '../../../src'
import './styles.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css/normalize.css'
import createIsSelectedAtom from './create-is-selected-atom'

type NodeAtom = Atom<typeof initialState[number]>
type NodesAtom = Atom<typeof initialState>

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

export default Canvas
