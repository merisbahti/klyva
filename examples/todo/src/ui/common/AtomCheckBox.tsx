import * as React from 'react'
import { useAtom } from 'klyva'
import { Atom } from 'klyva/dist/types'

/*
A generic component that connects a bool atom to a checkbox.
Not specific to TodoMVC, could conceivably be included in a 
generic Klyva React UI toolkit.
*/

type AtomCheckBoxProps = {
  boolAtom: Atom<boolean>
} & React.HTMLAttributes<HTMLInputElement>

export const AtomCheckBox = ({ boolAtom, ...rest }: AtomCheckBoxProps) => {
  const [checked, setChecked] = useAtom(boolAtom)
  return (
    <input
      {...rest}
      type="checkbox"
      checked={checked}
      onChange={() => setChecked(!checked)}
    />
  )
}
