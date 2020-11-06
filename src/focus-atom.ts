import {
  AffineFold,
  Equivalence,
  get,
  Getter,
  Iso,
  Lens,
  modify,
  optic,
  preview,
  Prism,
  set,
} from 'optics-ts'
import { atom } from './atom'
import { Atom, ReadableAtom, SetState } from './types'

function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) =>
    | Equivalence<Value, any, FocusedValue>
    | Iso<Value, any, FocusedValue>
    | Lens<Value, any, FocusedValue>,
): Atom<FocusedValue, SetState<FocusedValue>>

function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) => Prism<Value, any, FocusedValue>,
): Atom<FocusedValue | undefined, SetState<FocusedValue>>

function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) => AffineFold<Value, FocusedValue>,
): ReadableAtom<FocusedValue | undefined>

function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) => Getter<Value, FocusedValue>,
): ReadableAtom<FocusedValue>

function focusAtom<Value, FocusedValue>(
  baseAtom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) =>
    | Equivalence<Value, any, FocusedValue>
    | Iso<Value, any, FocusedValue>
    | Prism<Value, any, FocusedValue>
    | Lens<Value, any, FocusedValue>
    | AffineFold<Value, FocusedValue>
    | Getter<Value, FocusedValue>,
): any {
  const focus = opticCallback(optic<Value>())
  switch (focus._tag) {
    case 'Iso':
    case 'Equivalence':
    case 'Lens':
      return atom(
        getAtomValue => {
          const currentValue = getAtomValue(baseAtom)
          return get(focus)(currentValue)
        },
        (update: SetState<FocusedValue>) => {
          if (update instanceof Function) {
            baseAtom.update(modify(focus)(update))
          } else {
            baseAtom.update(set(focus)(update))
          }
        },
      )
    case 'Getter':
      return atom(getAtomValue => {
        const currentValue = getAtomValue(baseAtom)
        return get(focus)(currentValue)
      })
    case 'Prism':
      return atom(
        getAtomValue => {
          const currentValue = getAtomValue(baseAtom)
          return preview(focus)(currentValue)
        },
        (update: SetState<FocusedValue>) => {
          if (update instanceof Function) {
            baseAtom.update(modify(focus)(update))
          } else {
            baseAtom.update(set(focus)(update))
          }
        },
      )
    default:
      throw new Error(`Focus for ${focus._tag} is not implemented`)
  }
}

export default focusAtom
