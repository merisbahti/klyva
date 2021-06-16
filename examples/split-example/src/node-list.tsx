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
import { Button } from '@blueprintjs/core'
import createIsSelectedAtom from './create-is-selected-atom'

type NodeAtom = Atom<typeof initialState[number]>
type NodesAtom = Atom<typeof initialState>

const NodeList = ({
  nodesAtom,
  selectedIndexAtom,
}: {
  nodesAtom: NodesAtom
  selectedIndexAtom: Atom<number | null>
}) => {
  const nodeAtoms = useAtomSlice(nodesAtom)
  return (
    <>
      <Button
        icon="add"
        onClick={() =>
          nodesAtom.update(oldValue => [
            ...oldValue,
            { x: 0, y: 0, name: 'New value', backgroundColor: '#fafafa' },
          ])
        }
      ></Button>
      {nodeAtoms.map((nodeAtom, index) => (
        <NodeListItem
          key={index}
          nodeAtom={nodeAtom}
          isSelectedAtom={createIsSelectedAtom(selectedIndexAtom, index)}
        />
      ))}
    </>
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

export default NodeList
