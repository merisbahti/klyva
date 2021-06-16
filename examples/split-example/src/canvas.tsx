import * as React from 'react'
import initialState from './initialState'
import { Atom, useAtom, useSelector } from '../../../src'
import './styles.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css/normalize.css'

type NodeAtom = Atom<typeof initialState[number]>

const Canvas = ({
  backgroundColorAtom,
  children,
}: {
  backgroundColorAtom: Atom<string>
  children: React.ReactNode
}) => {
  const backgroundColor = useSelector(backgroundColorAtom)
  return (
    <div style={{ backgroundColor, width: '100%' }}>
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        {children}
      </div>
    </div>
  )
}

export const Node = ({
  nodeAtom,
  isSelectedAtom,
}: {
  nodeAtom: NodeAtom
  isSelectedAtom: Atom<boolean>
}) => {
  const [{ name, x, y }, setNode] = useAtom(nodeAtom)
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
          setNode(oldXY => ({
            ...oldXY,
            x: Math.max(0, oldXY.x + e.movementX),
            y: Math.max(0, oldXY.y + e.movementY),
          }))
        }
      }}
      style={{
        zIndex: isMoving ? 10 : 0,
        position: 'absolute',
        height: 200,
        width: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'center',
        textAlign: 'center',
        left: x,
        top: y,
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
