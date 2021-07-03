import React from 'react'
import { atom } from '../atom-constructors'
import { Atom } from '..'

export * from './use-atom'

export const useCreateAtom = <Value>(makeInitialValue: () => Value) => {
  const [createdAtom] = React.useState<Atom<Value>>(() =>
    atom(makeInitialValue()),
  )
  return createdAtom
}
