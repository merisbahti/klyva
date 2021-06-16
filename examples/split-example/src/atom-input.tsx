import * as React from 'react'
import { HTMLInputProps } from '@blueprintjs/core'
import { Atom, useAtom } from '../../../src'

const AtomInput = <T extends string>({
  atom,
  ...inputProps
}: { atom: Atom<T> } & Omit<HTMLInputProps, 'value' | 'onChange'>) => {
  const [value, setValue] = useAtom<string>(atom)
  return (
    <input
      {...inputProps}
      value={value}
      onChange={event => {
        setValue(event.target.value)
      }}
    />
  )
}

export default AtomInput
