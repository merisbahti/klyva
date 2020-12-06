import { ReadableAtom } from './types'
import * as cb from 'callbag'

export const atomToSource = <T>(atom: ReadableAtom<T>): cb.Source<T> => {
  return (type: 0 | 1 | 2, data: cb.Sink<T>) => {
    if (type === 0) {
      const sink = data
      let unsubscribe = atom.subscribe(value => {
        sink(1, value)
      })
      const talkback = (t: 0 | 1 | 2) => {
        if (t === 2) unsubscribe()
      }
      sink(0, talkback)
    }
  }
}
