import * as React from 'react'
import { useAtom } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'

type CheckBoxProps = {
  checkedAtom: PrimitiveAtom<boolean>
}

export const CheckBox = ({ checkedAtom }: CheckBoxProps) => {
  const [checked, setChecked] = useAtom(checkedAtom)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => setChecked(!checked)}
    />
  )
}
