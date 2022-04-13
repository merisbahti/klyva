import * as React from 'react'
import {
  Atom,
  atom,
  focusAtom,
  useAtom,
  useAtomSlice,
  useSelector,
} from '../../../dist/index'
import { createRoot } from 'react-dom/client'
import initialState from './initialState'
import './styles.css'

const formListAtom = atom<Record<string, Record<string, string>>>(initialState)

const Field = ({
  fieldAtom,
  removeField,
}: {
  fieldAtom: Atom<{ name: string; value: string }>
  removeField: () => void
}) => {
  const [name, setName] = useAtom(focusAtom(fieldAtom, o => o.prop('name')))
  const [value, setValue] = useAtom(focusAtom(fieldAtom, o => o.prop('value')))
  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button onClick={removeField}>X</button>
    </div>
  )
}

const Form = ({
  formAtom,
  nameAtom,
  remove,
}: {
  formAtom: Atom<Record<string, string>>
  nameAtom: Atom<string>
  remove: () => void
}) => {
  const objectsAtom = focusAtom(formAtom, o =>
    o.iso(
      bigObject =>
        Object.entries(bigObject).map(([name, value]) => ({
          name,
          value,
        })),
      arrayOfObjects =>
        Object.fromEntries(
          arrayOfObjects.map(({ name, value }) => [name, value]),
        ),
    ),
  )
  const fieldAtoms = useAtomSlice(objectsAtom)
  const [name, setName] = useAtom(nameAtom)

  const addField = () =>
    objectsAtom.update(oldValue => [
      ...oldValue,
      { name: `new field ${Math.floor(Math.random() * 1000)}`, value: '' },
    ])

  return (
    <div>
      <div>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button onClick={remove}>Remove form</button>
      </div>

      <ul>
        {fieldAtoms.map((fieldAtom, i) => (
          <li key={i}>
            <Field fieldAtom={fieldAtom} removeField={fieldAtom.remove} />
          </li>
        ))}
      </ul>
      <button onClick={addField}>Add field</button>
    </div>
  )
}

const FormList = ({
  formListAtom,
}: {
  formListAtom: Atom<Record<string, Record<string, string>>>
}) => {
  const entriesAtom = focusAtom(formListAtom, o =>
    o.iso(
      obj => Object.entries(obj),
      array => Object.fromEntries(array),
    ),
  )
  const formAtoms = useAtomSlice(entriesAtom)

  const addForm = () =>
    entriesAtom.update(oldValue => [
      ...oldValue,
      [`new form ${Math.floor(Math.random() * 1000)}`, {}],
    ])

  return (
    <ul>
      {formAtoms.map((formEntryAtom, i) => (
        <li key={i}>
          <Form
            nameAtom={focusAtom(formEntryAtom, o => o.nth(0))}
            formAtom={focusAtom(formEntryAtom, o => o.nth(1))}
            remove={formEntryAtom.remove}
          />
        </li>
      ))}
      <button onClick={addForm}>Add new form</button>
    </ul>
  )
}

const App = () => {
  const allState = useSelector(formListAtom, v => JSON.stringify(v, null, 2))
  return (
    <>
      <FormList formListAtom={formListAtom} />
    </>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<App />)
}
