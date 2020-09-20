# Klyva
*Klyva means to cleave in swedish*

A simple state management solution for react, similar to:
[Recoil.js](https://recoiljs.org)
[jotai](https://jotai.surge.sh)

But with optics, so it's easier to "cleave" an atom so you can create atom that a component can listen to, and update, without listening to the whole state.

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


### Focus on properties on an atom (lenses, prisms, isos)

```typescript
const objectAtom = atom({a: 10})
const focusedATom = objectAtom.focus(optic => optic.prop('a'))
```

See more about optics at:
https://github.com/akheron/optics-ts

## Differences from jotai and recoil

* No `<Provider>` needed
* No `key` needed for atom
* No explicit React utils served (yet)


