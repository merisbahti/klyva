[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/merisbahti/klyva)

# Klyva
*Klyva means to cleave in swedish*

A simple state management solution for react, similar to:

* [Recoil.js](https://recoiljs.org)
* [jotai](https://jotai.surge.sh)

But with optics, so it's easier to "cleave" an atom so you can create atom that a component can listen to, and update, without listening to the whole state.

Questions? [Discord](https://discord.com/invite/wXTMagCv)

## How to
### Create an atom

```typescript
const numberAtom = atom(5)
const objectAtom = atom({a: 10})
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

sumAtom.subscribe((newValue) => console.log(`My new value is: ${newValue}`))

sumAtom.value() // 30

atomOne.update(value => value + 1)
atomTwo.update(value => value + 1)

sumAtom.value() // 32
```


### Focus on properties on an atom (lenses, prisms, isos)

```typescript
const objectAtom = atom({a: 10})
const focusedATom = focusAtom(objectAtom, optic => optic.prop('a'))
```

See more about optics at:
https://github.com/akheron/optics-ts

### Usage with react

```
const myAtom = atom('hello')
const MyComponent = () => {
  const myAtomValue = useAtom(myAtom)
  const onClick = myAtom.update(oldValue => oldValue + '!')
  <button onClick={onClick}>{myAtomValue}</div>
}
```

## Differences from jotai and recoil

* No `<Provider>` needed
* No `key` needed for atom


