import * as React from 'react'
import { useAtom } from 'klyva'
import { PrimitiveAtom } from 'klyva/dist/types'

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
