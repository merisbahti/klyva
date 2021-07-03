import React from 'react'
import { atom } from '../atom-constructors'
import { ReadableAtom } from '../types'
import { identity } from '../inner-utils'
import { useAtom } from './use-atom'

type UseSelector = {
  <S, A>(
    sourceAtom: ReadableAtom<S>,
    selector: (source: S) => A,
    equals?: (left: S, right: S) => boolean,
  ): A
  <S>(sourceAtom: ReadableAtom<S>): S
}

export const useSelector: UseSelector = (
  sourceAtom: any,
  selector: any = identity,
  equals = Object.is,
) => {
  const latestValueRef = React.useRef<any>()
  const selectorAtom = atom(get => {
    const newSlice = selector(get(sourceAtom))
    if (
      latestValueRef.current === undefined ||
      !equals(newSlice, latestValueRef.current)
    ) {
      latestValueRef.current = newSlice
    }
    return latestValueRef.current
  })

  return useAtom(selectorAtom)[0]
}
