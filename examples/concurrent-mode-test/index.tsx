import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { atom, useAtom } from '../../src'
import {
  createApp,
  doubleAction,
  incrementAction,
  initialState,
  reducer,
} from './create-app'

const stateAtom = atom(initialState)

const useCount = () => useAtom(stateAtom)[0].count

const useIncrement = () => () =>
  stateAtom.update(value => reducer(value, incrementAction))

const useDouble = () => () =>
  stateAtom.update(value => reducer(value, doubleAction))

const App = createApp(useCount, useIncrement, useDouble)

const rootElement = document.getElementById('root')
const root = rootElement && ReactDOM.unstable_createRoot(rootElement)
root?.render(<App />)
