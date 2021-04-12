import * as React from 'react'
import initialState from './initialState'
import { Atom, focusAtom, useAtom } from '../../../src'
import './styles.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css/normalize.css'

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
export default NodeSettings
