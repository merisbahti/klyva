import * as React from 'react'
import initialState from './initialState'
import { Atom, focusAtom, useSelector, useDeprismify } from '../../../src'
import './styles.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css/normalize.css'
import NodeSettings from './node-settings'
import AtomInput from './atom-input'

const Settings = ({
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
  return (
    <>
      <h2>Document:</h2>
      <div>
        Background color: <AtomInput type="color" atom={backgroundColorAtom} />
      </div>

      <h2>Selection:</h2>
      {selectedAtom ? (
        <NodeSettings nodeAtom={selectedAtom} />
      ) : (
        'Select an item.'
      )}
    </>
  )
}

export default Settings
