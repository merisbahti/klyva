import { Observable } from 'rxjs/internal/Observable'
import { take } from 'rxjs/operators'
import { ReadableAtom } from './types'

const observeForOneValue = <T>(atom: ReadableAtom<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const unsubscribe = atom.subscribe(value => {
      observer.next(value)
    })
    return () => {
      unsubscribe()
    }
  }).pipe(take(1))
}

export default observeForOneValue
