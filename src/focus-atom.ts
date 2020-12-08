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

// remove when tsdx is fixed
// eslint-disable-next-line no-redeclare
function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) => Prism<Value, any, FocusedValue>,
): Atom<FocusedValue | undefined, SetState<FocusedValue>>

// remove when tsdx is fixed
// eslint-disable-next-line no-redeclare
function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) => AffineFold<Value, FocusedValue>,
): ReadableAtom<FocusedValue | undefined>

// remove when tsdx is fixed
// eslint-disable-next-line no-redeclare
function focusAtom<Value, FocusedValue>(
  atom: Atom<Value, SetState<Value>>,
  opticCallback: (
    optic: Equivalence<Value, any, Value>,
  ) => Getter<Value, FocusedValue>,
): ReadableAtom<FocusedValue>

// remove when tsdx is fixed
// eslint-disable-next-line no-redeclare
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
) {
  const focus = opticCallback(optic<Value>())
  switch (focus._tag) {
    case 'Iso':
    case 'Equivalence':
    case 'Lens':
      return atom(
        getAtomValue => get(focus)(getAtomValue(baseAtom)),
        (update: SetState<FocusedValue>) => {
          const nextValue = (update instanceof Function
            ? modify(focus)(update)
            : set(focus)(update))(baseAtom.getValue())
          baseAtom.update(nextValue)
        },
      )
    case 'Getter':
      return atom(getAtomValue => get(focus)(getAtomValue(baseAtom)))
    case 'AffineFold':
      return atom(getAtomValue => preview(focus)(getAtomValue(baseAtom)))
    case 'Prism':
      return atom(
        getAtomValue => preview(focus)(getAtomValue(baseAtom)),
        (update: SetState<FocusedValue>) => {
          const nextValue = (update instanceof Function
            ? modify(focus)(update)
            : set(focus)(update))(baseAtom.getValue())
          baseAtom.update(nextValue)
        },
      )
  }
}

export default focusAtom
