import * as React from 'react'
import { useAtom } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'

type AtomCheckBoxProps = {
  checkedAtom: PrimitiveAtom<boolean>
}

export const AtomCheckBox = ({ checkedAtom }: AtomCheckBoxProps) => {
  const [checked, setChecked] = useAtom(checkedAtom)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => setChecked(!checked)}
    />
  )
}
