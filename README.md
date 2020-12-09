[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/merisbahti/klyva)

# Klyva
Flexible state management for React.

Similar to: 

* [Recoil.js](https://recoiljs.org)
* [jotai](https://jotai.surge.sh)

But _both_ composable and decomposable state.

Questions? [Discord](https://discord.gg/5HXQ8Kagu6)

*Klyva means to cleave in swedish*

## How to
### Create an atom

```typescript
const numberAtom = atom(5)
```

### Update it

```typescript
const numberAtom = atom(5)

numberAtom.update(6)
numberAtom.update(value => value + 1)
```

### Read from it

```typescript
const numberAtom = atom(5)

numberAtom.subscribe(value => console.log('my value is:', value))
// my value is 5

numberAtom.write(6)
// my value is 6
```

### Composition
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

```typescript
const objectAtom = atom({a: 10})
const focusedAtom = focusAtom(objectAtom, optic => optic.prop('a'))

focusedAtom.getValue() // 10
focusedAtom.update(v => v + 1)

focusedAtom.getValue() // 11
objectAtom.getValue() // {a: 11}
```

This creates a derived atom. This atom, views, and can update the `a` prop of `objectAtom`.

See more about optics at:
https://github.com/akheron/optics-ts

### Usage with react

```typescript
const myAtom = atom('hello')
const MyComponent = () => {
  const [value, setValue] = useAtom(myAtom)
  const onClick = () => setValue(oldValue => oldValue + '!')
  return <button onClick={onClick}>{value}</button>
}
```

## Differences from jotai and recoil

* No `<Provider>` needed
* No `key` needed for atom
* More performant: Atoms are _minimally_ expensive to create, and you can create them almost for free in react components.
* No memory leaks (especially when atoms are created adhoc)

