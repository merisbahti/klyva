import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { Atom, CustomAtom, ReadableAtom, Updater } from '../types'
import { equal } from '../inner-utils'

export function useAtom<Value>(
  atom: Atom<Value>,
): [Value, (updater: Updater<Value>) => void]
export function useAtom<Value, Updater>(
  atom: CustomAtom<Value, Updater>,
): [Value, (updater: Updater) => void]
export function useAtom<Value>(atom: ReadableAtom<Value>): [Value]
export function useAtom<Value, Updater = unknown>(
  atom: ReadableAtom<Value> & { update?: (updater: Updater) => void },
) {
  const [cache, setCache] = React.useState(atom.getValue)
  React.useEffect(() => {
    setCache(oldCache => {
      const currValue = atom.getValue()
      if (equal(currValue, oldCache)) {
        return oldCache
      }
      return currValue
    })
    const unsub = atom.subscribe(value => setCache(() => value))
    return unsub
  }, [atom])
  const updaterMaybe: null | ((updater: Updater) => void) = React.useMemo(
    () =>
      atom.update
        ? updater => {
            unstable_batchedUpdates(() => {
              atom.update?.(updater)
            })
          }
        : null,
    [atom],
  )
  return [cache, ...(updaterMaybe ? [updaterMaybe] : [])]
}
