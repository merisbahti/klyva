// adds types to other packages

declare module 'callbag-tap' {
  import { Source } from 'callbag'

  const tap: <T>(cb: (value: T) => void) => (source: Source<T>) => Source<T>
  export default tap
}

declare module 'callbag-behavior-subject' {
  import { Source } from 'callbag'

  const createBehaviorSubject: <T>(initialValue: T) => Source<T>
  export default createBehaviorSubject
}

declare module 'callbag-merge-map' {
  import { Source } from 'callbag'

  const mergeMap: <T, B>(
    cb: (value: T) => Source<B>,
  ) => (source: Source<T>) => Source<B>
  export default mergeMap
}
