// adds types to other packages

declare module 'callbag-tap' {
  import { Source } from 'callbag'

  const tap: <T>(cb: (value: T) => void) => (source: Source<T>) => Source<T>
  export default tap
}

declare module 'callbag-concat-map' {
  import { Source } from 'callbag'

  const concatMap: <T, B>(
    cb: (value: T) => Source<B>,
  ) => (source: Source<T>) => Source<B>
  export default concatMap
}
