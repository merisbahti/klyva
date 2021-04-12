import * as React from 'react'
import initialState from './initialState'
import { Atom, focusAtom } from '../../../src'
import './styles.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css/normalize.css'
import AtomInput from './atom-input'

const NodeSettings = ({
  nodeAtom,
}: {
  nodeAtom: Atom<typeof initialState[number]>
}) => {
  return (
    <div style={{ width: '100' }}>
      <div>
        <AtomInput
          atom={focusAtom(nodeAtom, o => o.prop('name'))}
          type="text"
        />
      </div>
      <div>
        <AtomInput
          type="number"
          atom={focusAtom(nodeAtom, o => o.prop('x').iso(String, Number))}
        />
      </div>
      <div>
        <AtomInput
          type="number"
          atom={focusAtom(nodeAtom, o => o.prop('y').iso(String, Number))}
        />
      </div>
    </div>
  )
}
export default NodeSettings
