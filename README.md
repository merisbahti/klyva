[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/merisbahti/klyva)

# 🪓 klyva

Scalable state management for React.

Minimal API, with reactive, composable and decomposable state!

Questions? [Discord](https://discord.gg/5HXQ8Kagu6)

*Klyva means to cleave in swedish*

## How to
### Create an atom

A base atom can be constructed by giving the `atom` a value.

```typescript
const countAtom = atom(5)
```

### useAtom

The `useAtom` hook subscribes to changes to the atom, so if it's updated, then this component is notified and updated.
The hook is similar to react's `useState` in that it gives a `setState` function.

```tsx
const MyComponent = () => {
  const [value, setValue] = useAtom(countAtom)
  const increase = () => setValue(oldValue => oldValue + 1)
  return <button onClick={increase}>{value}</button>
}
```

### Composition

Atoms are composable. Meaning that you can *glue* together two atoms using the `get` function, when any dependant atoms are updated, the derived atom is updated:

```typescript
const atomOne = atom(10)
const atomTwo = atom(20)
const sumAtom = atom(get => get(atomOne) + get(atomTwo))
```

### Decomposition

You can focus on a smaller part of an atom, to view and update that smaller part (`focusedAtom`) - which in turn updates the derivee (`objectAtom`).

```typescript
const objectAtom = atom({a: 10})
const focusedAtom = focusAtom(objectAtom, optic => optic.prop('a'))

const MyComponent = () => {
  const [value, setValue] = useAtom(focusedAtom)
  const increase = () => setValue(oldValue => oldValue + 1)
  return <button onClick={increase}>{value}</button>
}
```

See more about optics at:
https://github.com/akheron/optics-ts

### Usage outside of react

#### Subscribe 
Use the `subscribe` function to subscribe to changes for this atom:

```tsx
const counterAtom = atom(0)
counterAtom.subscribe(count => console.log(`The count is: ${count}`))
counterAtom.update(count => count + 1)
// console: The count is: 1
```

### Update it
Atoms have an `update` function, which can be used to update it outside of react:

```typescript
const numberAtom = atom(5)

numberAtom.update(6)
numberAtom.update(value => value + 1)
```

## Advanced example

When you have an atom which contains a list, and you want to delegate control of each list item, you can use the `useAtomSlice`-hook like this:

```tsx
const listAtom = atom([0,0,0])

const CounterList = () => {
  const counterAtoms = useAtomSlice(listAtom)
  const addCounter = () => listAtom.update(counters => [...counters, 0])
  return (
    <>
      <ul>
        {counterAtoms.map((atom) => <Counter counterAtom={atom} onRemove={atom.remove} />)}
      </ul>
      <button onClick={addCounter}>
        Add counter
      </button>
    </>
  )
}

const Counter = ({counterAtom, onRemove}: {counterAtom: PrimitiveAtom<number>, onRemove: () => void}) => {
  const [count, setCount] = useAtom(counterAtom)
  return (
    <li>
      <button onClick={() => setCount(v => v + 1)}>{count}</button>
      <button onClick={onRemove}>Remove me</button>
    </li>
  )
}
```

Curious? See [codesandbox](https://codesandbox.io/s/adoring-waterfall-2ot5y?file=/src/App.tsx)!

## Differences from jotai and recoil

* No `<Provider>` needed
* No `key` needed for atom
* More performant: Atoms are _minimally_ expensive to create, and you can create them almost for free in react components.
* Usage outside of react components is supported, so you can listen to changes and update atoms from outside of a react context.
