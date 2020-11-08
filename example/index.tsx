import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useAtomSlice } from '../src/react-utils'
import focusAtom from '../src/focus-atom'
import { atom } from '../src/atom'

const RecursiveFormAtom = atom<Record<string, Record<string, string>>>({
  form1: { task: 'Eat some food', checked: 'yeah' },
  form2: { task: 'Eat some food', checked: 'yeah' },
  form3: { task: 'Eat some food', checked: 'yeah' },
  form4: { task: 'Eat some food', checked: 'yeah' },
  form5: { task: 'Eat some food', checked: 'yeah' },
  form6: { task: 'Eat some food', checked: 'yeah' },
  form7: { task: 'Eat some food', checked: 'yeah' },
  form8: { task: 'Eat some food', checked: 'yeah' },
})

const FormList = ({ todos }: { todos: typeof RecursiveFormAtom }) => {
  const entriesFocus = focusAtom(todos, optic =>
    optic.iso(
      x => Object.entries(x),
      x => Object.fromEntries(x),
    ),
  )
  const atoms = useAtomSlice(entriesFocus)
  return (
    <ul>
      {atoms.map((atom, i) => (
        <>
          Form nr ({i})
          <Form formAtom={atom} onRemove={atom.remove} />
        </>
      ))}
      <button
        onClick={() =>
          entriesFocus.update(oldValue => [
            ...oldValue,
            [
              `form${oldValue.length + 1}`,
              {
                name: 'New name',
                otherAttribute: 'value',
              },
            ],
          ])
        }
      >
        Add new form
      </button>
    </ul>
  )
}

const Form = ({
  formAtom,
  onRemove,
}: {
  formAtom: PrimitiveAtom<[string, { [key: string]: string }]>
  onRemove: () => void
}) => {
  const entriesAtom = focusAtom(formAtom, optic =>
    optic.index(1).iso(Object.entries, to => Object.fromEntries(to)),
  ) as PrimitiveAtom<[string, string][]>

  const fieldAtoms = useAtomSlice(entriesAtom)
  const addField = () => {
    entriesAtom.update(oldValue => [
      ...oldValue,
      ['Something new ' + oldValue.length, 'New too'],
    ])
  }
  const nameAtom = focusAtom(formAtom, optic => optic.head())
  const name = useAtom(nameAtom)

  return (
    <div>
      <input
        value={name as string}
        onChange={e => {
          nameAtom.update(e.target.value)
        }}
      />
      <ul>
        {fieldAtoms.map(fieldAtom => (
          <Field field={fieldAtom} onRemove={fieldAtom.remove} />
        ))}
        <li>
          <button onClick={addField}>Add new field</button>
        </li>
        <li>
          <button onClick={onRemove}>Remove this form</button>
        </li>
      </ul>
    </div>
  )
}

const Field = ({
  field,
  onRemove,
}: {
  field: PrimitiveAtom<[string, string]>
  onRemove: () => void
}) => {
  const nameAtom = focusAtom(field, optic => optic.index(0))
  const valueAtom = focusAtom(field, optic => optic.index(1))
  const name = useAtom(nameAtom)
  const value = useAtom(valueAtom)

  return (
    <li>
      <input
        type="text"
        value={name}
        onChange={e => {
          nameAtom.update(e.target.value)
        }}
      />
      <input
        type="text"
        value={value}
        onChange={e => valueAtom.update(e.target.value)}
      />
      <button onClick={onRemove}>X</button>
    </li>
  )
}

const App = () => {
  const value = useAtom(RecursiveFormAtom)
  return (
    <div>
      <FormList todos={RecursiveFormAtom} />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
