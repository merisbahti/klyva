import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import { atom, focusAtom, useAtom, useAtomSlice } from '../../src/index'
import { PrimitiveAtom } from '../../src/types'

const OriginalAtom = atom<Record<string, Record<string, string>>>({
  form1: { task: 'Eat some food', checked: 'yeah' },
  form2: { task: 'Eat some food', checked: 'yeah' },
  form3: { task: 'Eat some food', checked: 'yeah' },
  form4: { task: 'Eat some food', checked: 'yeah' },
  form5: { task: 'Eat some food', checked: 'yeah' },
  form6: { task: 'Eat some food', checked: 'yeah' },
  form7: { task: 'Eat some food', checked: 'yeah' },
  form8: { task: 'Eat some food', checked: 'yeah' },
  form12: { task: 'Eat some food', checked: 'yeah' },
  form22: { task: 'Eat some food', checked: 'yeah' },
  form32: { task: 'Eat some food', checked: 'yeah' },
  form42: { task: 'Eat some food', checked: 'yeah' },
  form52: { task: 'Eat some food', checked: 'yeah' },
  form62: { task: 'Eat some food', checked: 'yeah' },
  form72: { task: 'Eat some food', checked: 'yeah' },
  form82: { task: 'Eat some food', checked: 'yeah' },
  form14: { task: 'Eat some food', checked: 'yeah' },
  form24: { task: 'Eat some food', checked: 'yeah' },
  form34: { task: 'Eat some food', checked: 'yeah' },
  form44: { task: 'Eat some food', checked: 'yeah' },
  form54: { task: 'Eat some food', checked: 'yeah' },
  form64: { task: 'Eat some food', checked: 'yeah' },
  form74: { task: 'Eat some food', checked: 'yeah' },
  form84: { task: 'Eat some food', checked: 'yeah' },
  form15: { task: 'Eat some food', checked: 'yeah' },
  form25: { task: 'Eat some food', checked: 'yeah' },
  form35: { task: 'Eat some food', checked: 'yeah' },
  form45: { task: 'Eat some food', checked: 'yeah' },
  form55: { task: 'Eat some food', checked: 'yeah' },
  form65: { task: 'Eat some food', checked: 'yeah' },
  form75: { task: 'Eat some food', checked: 'yeah' },
  form85: { task: 'Eat some food', checked: 'yeah' },
})

const RecursiveFormAtom: typeof OriginalAtom = atom(
  get => get(OriginalAtom),
  param => {
    OriginalAtom.update(param)
  },
)

const FormList = ({ todos }: { todos: typeof RecursiveFormAtom }) => {
  const entriesAtom = focusAtom(todos, optic =>
    optic.iso(
      from => Object.entries(from),
      to => Object.fromEntries(to),
    ),
  )
  const atoms = useAtomSlice(entriesAtom)
  const changeFormAtom = todos.update
  return (
    <ul>
      {atoms.map((atom, i) => (
        <div key={i}>
          <Form formAtom={atom} onRemove={atom.remove} />
        </div>
      ))}
      <button
        onClick={() =>
          changeFormAtom(oldValue => ({
            ...oldValue,
            [`newForm ${Math.random()}`]: {
              name: 'New name',
              otherAttribute: 'value',
            },
          }))
        }
      >
        Add another form
      </button>
    </ul>
  )
}

const Form = ({
  formAtom,
  onRemove,
}: {
  formAtom: PrimitiveAtom<[string, Record<string, string>]>
  onRemove: () => void
}) => {
  const entriesAtom = focusAtom(formAtom, optic =>
    optic.index(1).iso(
      from => Object.entries(from),
      to => Object.fromEntries(to),
    ),
  ) as PrimitiveAtom<[string, string][]>
  const fieldAtoms = useAtomSlice(entriesAtom)
  const addField = () =>
    entriesAtom.update(oldValue => [
      ...oldValue,
      ['Something new' + Math.random(), 'New too'],
    ])
  const fieldNameAtom = focusAtom(formAtom, optic =>
    optic.index(0),
  ) as PrimitiveAtom<string>
  const [fieldName, setFieldName] = useAtom(fieldNameAtom)

  return (
    <div>
      <h1>
        <input
          value={fieldName}
          onChange={event => setFieldName(event.target.value)}
        />
      </h1>
      <ul>
        {fieldAtoms.map((fieldAtom, index) => (
          <Field key={index} field={fieldAtom} onRemove={fieldAtom.remove} />
        ))}
      </ul>
      <div>
        <button style={{ width: '100%' }} onClick={addField}>
          Add new field
        </button>
      </div>
      <div>
        <button onClick={onRemove}>Remove this form</button>
      </div>
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
  const [name, setName] = useAtom(focusAtom(field, optic => optic.index(0)))
  const [value, setValue] = useAtom(focusAtom(field, optic => optic.index(1)))

  return (
    <li>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button onClick={onRemove}>X</button>
    </li>
  )
}

const App = () => {
  const allState = null /*useSelector(RecursiveFormAtom, v =>
    JSON.stringify(v, null, 2),
  )*/
  return (
    <>
      <FormList todos={RecursiveFormAtom} />
      <pre>{allState}</pre>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
