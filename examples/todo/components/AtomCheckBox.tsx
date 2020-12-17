import * as React from 'react'
import { useAtom } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'

type AtomCheckBoxProps = {
  boolAtom: PrimitiveAtom<boolean>
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
