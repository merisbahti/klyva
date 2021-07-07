import { AtomMeta, ReadableAtom } from '../types'
import { meta } from '../symbols'

let id = 0
export const uuid = () => (++id).toString()

const newMeta = (name?: string) => ({
  id: uuid(),
  name: name ?? 'AnonymousAtom',
})

export const ensureAtomMeta = (atom: ReadableAtom<unknown>) => {
  if (!atom[meta]) {
    atom[meta] = newMeta()
  }
}

export const getAtomMeta = (atom: ReadableAtom<unknown>) => {
  ensureAtomMeta(atom)
  return atom[meta]!
}

export const getAtomName = (atom: ReadableAtom<unknown>) =>
  getAtomMeta(atom).name

export function setAtomMeta<V extends any, A extends ReadableAtom<V>>(
  atom: A,
  name?: string,
): A
export function setAtomMeta<V extends any, A extends ReadableAtom<V>>(
  atom: A,
  meta?: AtomMeta,
): A
export function setAtomMeta<V extends any, A extends ReadableAtom<V>>(
  atom: A,
  updater?: (meta: AtomMeta) => AtomMeta,
): A
export function setAtomMeta<V extends any, A extends ReadableAtom<V>>(
  atom: A,
  meta?: string | AtomMeta,
): A
export function setAtomMeta<V extends any, A extends ReadableAtom<V>>(
  atom: A,
  updater?: AtomMeta | string | undefined | ((meta: AtomMeta) => AtomMeta),
): A {
  const prevMeta = getAtomMeta(atom)
  const updatedMeta =
    typeof updater === 'function'
      ? updater(prevMeta)
      : typeof updater === 'string'
      ? { ...prevMeta, name: updater }
      : typeof updater === 'undefined'
      ? prevMeta
      : updater
  atom[meta] = updatedMeta
  return atom
}
