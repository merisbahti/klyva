import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useAtomSlice } from '../src/react-utils'
import focusAtom from '../src/focus-atom'
import { atom } from '../src/atom'

const RecursiveFormAtom = atom<Array<{ [key: string]: string }>>([
  { task: 'Eat some food', checked: 'yeah' },
  { task: 'Go for a walk', checked: 'yeah' },
])

const FormList = ({ todos }: { todos: typeof RecursiveFormAtom }) => {
  const atoms = useAtomSlice(todos)
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
          todos.update(oldValue => [
            ...oldValue,
            { name: 'New name', otherAttribute: 'value' },
          ])
        }
      >
        Add new todo
      </button>
    </ul>
  )
}

const Form = ({
  formAtom,
  onRemove,
}: {
  formAtom: PrimitiveAtom<{ [key: string]: string }>
  onRemove: () => void
}) => {
  const entriesAtom = focusAtom(formAtom, optic =>
    optic.iso(Object.entries, to => Object.fromEntries(to)),
  )

  const fieldAtoms = useAtomSlice(entriesAtom)
  const addField = () => {
    entriesAtom.update(oldValue => [
      ...oldValue,
      ['Something new ' + oldValue.length, 'New too'],
    ])
  }

  return (
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
  //const value = useAtom(RecursiveFormAtom)
  return (
    <div>
      <FormList todos={RecursiveFormAtom} />
    </div>
  )
}
//<pre>{JSON.stringify(value, null, 2)}</pre>

ReactDOM.render(<App />, document.getElementById('root'))
