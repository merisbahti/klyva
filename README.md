[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/merisbahti/klyva)

# 🪓 klyva

Scalable state management for React.

Similar to: 

* [Recoil.js](https://recoiljs.org)
* [jotai](https://jotai.surge.sh)

But with _both_ composable and decomposable state.

Questions? [Discord](https://discord.gg/5HXQ8Kagu6)

*Klyva means to cleave in swedish*

## How to
### Create an atom

```typescript
const numberAtom = atom(5)
```

### Update it

There are two ways one can update atoms, either by sending the value directly - or by sending a callback.

```typescript
const numberAtom = atom(5)

numberAtom.update(6)
numberAtom.update(value => value + 1)
```

### Read from it

use `subscribe()` to subscribe to all future updates of an atom, and `getValue()` to get the current value of it.

```typescript
const numberAtom = atom(5)

numberAtom.subscribe(value => console.log('my value is:', value))

numberAtom.update(6)
// log: my value is 6

numberAtom.getValue() // 6
```

### Composition

Atoms are composable. Meaning that you can *glue* together two atoms using the `get` function:

```typescript
const atomOne = atom(10)
const atomTwo = atom(20)
const sumAtom = atom(get => get(atomOne) + get(atomTwo))

sumAtom.getValue() // 30

atomOne.update(value => value + 1)

sumAtom.getValue() // 32

atomTwo.update(value => value + 1)

sumAtom.getValue() // 32
```

### Decomposition

You can focus on a smaller part of an atom, to view and update that smaller part (`focusedAtom`) - which in turn updates the derivee (`objectAtom`).

```typescript
const objectAtom = atom({a: 10})
const focusedAtom = focusAtom(objectAtom, optic => optic.prop('a'))

focusedAtom.getValue() // 10
focusedAtom.update(v => v + 1)

focusedAtom.getValue() // 11
objectAtom.getValue() // {a: 11}
```

See more about optics at:
https://github.com/akheron/optics-ts

### Usage with react

#### useAtom

```typescript
const myAtom = atom('hello')
const MyComponent = () => {
  const [value, setValue] = useAtom(myAtom)
  const onClick = () => setValue(oldValue => oldValue + '!')
  return <button onClick={onClick}>{value}</button>
}
```

The `useAtom` hook implicitly subscribes to changes to the `myAtom` atom, so if it's updated (either in this component or outside), then this component is notified and updated.

#### useAtomSlice

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
* No memory leaks (especially when atoms are created adhoc)

