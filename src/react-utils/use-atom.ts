import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { useSyncExternalStoreExtra } from 'use-sync-external-store/extra'

import { Atom, CustomAtom, ReadableAtom, Updater } from '../types'
import { equal } from '../inner-utils'

const idSelector = <T>(value: T): T => value

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
  const value = useSyncExternalStoreExtra(
    atom.subscribe,
    atom.getValue,
    atom.getValue,
    idSelector,
    equal,
  )
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
  return [value, ...(updaterMaybe ? [updaterMaybe] : [])]
}
