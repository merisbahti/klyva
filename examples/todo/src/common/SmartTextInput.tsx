import * as React from 'react'

/*
A text input with an extra onEnter prop, and that blurs when pressing escape.
Nothing to do with Klyva, just regular React (and barely even that)
*/

type SmartTextInputProps = {
  onEnter?: (evt: React.KeyboardEvent<HTMLInputElement>) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export const SmartTextInput = ({ onEnter, ...rest }: SmartTextInputProps) => {
  const handleKeyUp = React.useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        onEnter?.(evt)
      }
      if (evt.key === 'Escape') {
        ;(evt.target as HTMLInputElement)?.blur()
      }
      rest.onKeyUp?.(evt)
    },
    [onEnter, rest],
  )
  return <input {...rest} onKeyUp={handleKeyUp} />
}
