import { atom } from '../src'
import focusAtom from '../src/focus-atom'
import { sliceAtomArray } from '../src/react-utils'
import { SetState } from '../src/types'

test('sliced work', done => {
  const arrayAtom = atom([1, 2, 3])
  const [focus0, focus1] = sliceAtomArray(arrayAtom)

  let focus0Updates = 0
  let focus1Updates = 0
  let myAtomUpdates = 0
  let latestFocus0Value = focus0.getValue()
  let latestFocus1Value = focus1.getValue()

  focus0.subscribe(value => {
    latestFocus0Value = value
    focus0Updates += 1
  })
  focus1.subscribe(value => {
    latestFocus1Value = value
    focus1Updates += 1
  })
  arrayAtom.subscribe(() => {
    myAtomUpdates += 1
  })

  expect(focus0Updates).toEqual(0)
  expect(focus1Updates).toEqual(0)
  expect(myAtomUpdates).toEqual(0)
  expect(latestFocus0Value).toEqual(1)
  expect(latestFocus1Value).toEqual(2)
  expect(arrayAtom.getValue()).toEqual([1, 2, 3])
  expect(focus0.getValue()).toEqual(1)
  expect(focus1.getValue()).toEqual(2)

  focus1.update(val => val + 2)
  focus0.update(val => val + 1)
  expect(latestFocus0Value).toEqual(2)
  expect(latestFocus1Value).toEqual(4)
  expect(arrayAtom.getValue()).toEqual([2, 4, 3])
  expect(focus0.getValue()).toEqual(2)
  expect(focus1.getValue()).toEqual(4)
  expect(focus0Updates).toEqual(1)
  expect(focus1Updates).toEqual(1)
  expect(myAtomUpdates).toEqual(2)
  done()
})

test('deep slices work', done => {
  const formsAtom = atom<Array<Record<string, string>>>([
    { task: 'Eat some food', checked: 'yeah' },
    { task: 'Go for a walk', checked: 'yeah' },
  ])

  const formAtoms = sliceAtomArray(formsAtom)
  const [form0Atom] = formAtoms
  const entriesFocus = atom<[string, string][], SetState<[string, string][]>>(
    get => Object.entries(get(form0Atom)),
    update => {
      const nextValue =
        update instanceof Function
          ? update(Object.entries(form0Atom.getValue()))
          : update
      form0Atom.update(Object.fromEntries(nextValue))
    },
  )

  const entryAtoms = sliceAtomArray(entriesFocus)

  const [entry0Atom] = entryAtoms
  const entry0NameAtom = focusAtom(entry0Atom, optic => optic.index(0))

  entry0NameAtom.subscribe(() => {})

  expect(entry0NameAtom.getValue()).toEqual('task')
  expect(entry0Atom.getValue()).toEqual(['task', 'Eat some food'])
  expect(form0Atom.getValue()).toEqual({
    task: 'Eat some food',
    checked: 'yeah',
  })
  expect(formsAtom.getValue()).toEqual([
    { task: 'Eat some food', checked: 'yeah' },
    { task: 'Go for a walk', checked: 'yeah' },
  ])

  entry0NameAtom.update(value => value.toUpperCase())

  expect(formsAtom.getValue()).toEqual([
    { TASK: 'Eat some food', checked: 'yeah' },
    { task: 'Go for a walk', checked: 'yeah' },
  ])
  expect(entry0Atom.getValue()).toEqual(['TASK', 'Eat some food'])
  expect(form0Atom.getValue()).toEqual({
    TASK: 'Eat some food',
    checked: 'yeah',
  })
  expect(entry0NameAtom.getValue()).toEqual('TASK')

  done()
})

test('removal of atom slices work', done => {
  const itemsAtom = atom(['hello', 'world'])

  const itemsAtoms = sliceAtomArray(itemsAtom)
  const [item0Atom, item1Atom] = itemsAtoms

  item0Atom.subscribe(() => {})
  item1Atom.subscribe(() => {})

  item0Atom.update('hello!!!')

  expect(itemsAtom.getValue()).toStrictEqual(['hello!!!', 'world'])
  expect(item0Atom.getValue()).toStrictEqual('hello!!!')
  expect(item1Atom.getValue()).toStrictEqual('world')

  item0Atom.remove()

  expect(item0Atom.getValue()).toStrictEqual('world')
  // value is stale
  expect(item1Atom.getValue()).toStrictEqual('world')

  itemsAtom.update(oldValue => ['hello', ...oldValue])

  expect(item0Atom.getValue()).toStrictEqual('hello')
  expect(item1Atom.getValue()).toStrictEqual('world')

  done()
})
