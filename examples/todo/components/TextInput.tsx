import * as React from 'react'
import { useAtom } from '../../../src/index'
import { PrimitiveAtom } from '../../../src/types'

type TextInputProps = {
  textAtom: PrimitiveAtom<string>
}

export const TextInput = ({ textAtom }: TextInputProps) => {
  const [text, setText] = useAtom(textAtom)
  return (
    <input
      type="text"
      value={text}
      onChange={event => setText(event.target.value)}
    />
  )
}
