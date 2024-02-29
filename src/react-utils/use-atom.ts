import { Atom, CustomAtom, ReadableAtom, Updater } from '../types'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

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
  return [useSyncExternalStore(atom.subscribe, atom.getValue), atom.update]
}
