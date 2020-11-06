import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PrimitiveAtom } from '../src/types'
import { useAtom, useNewAtom, useAtomSlice } from '../src/react-utils'
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
  const entriesAtom = React.useMemo(() => {
    return focusAtom(formAtom, optic =>
      optic.iso((from) => Object.entries(from), to => Object.fromEntries(to)),
    )
  }, [formAtom])
  const fieldAtoms = useAtomSlice(entriesAtom)
  const addField = (() => {
    entriesAtom.update(oldValue => [...oldValue, ['Something new ' + oldValue.length, 'New too']])
  })

  return (
    <ul>
      {fieldAtoms.map((fieldAtom) => <Field field={fieldAtom} onRemove={fieldAtom.remove} />)}
      <li><button onClick={addField}>Add new field</button></li>
      <li><button onClick={onRemove}>Remove this form</button></li>
    </ul>
  )
}

const Field = ({field, onRemove}: {field: PrimitiveAtom<[string, string]>, onRemove: () => void}) => {
  const [name, value] = useAtom(field)

    return <li>
      <input
        type="text"
        value={name}
        onChange={e => field.update((oldValue) => [e.target.value, oldValue[1]])}
      />
      <input
        type="text"
        value={value}
        onChange={e => field.update((oldValue) => [oldValue[0], e.target.value])}
      />
      <button onClick={onRemove}>X</button>
    </li>
}

const App = () => {
  return (
      <FormList todos={RecursiveFormAtom} />
  )
}


ReactDOM.render(<App />, document.getElementById('root'))
