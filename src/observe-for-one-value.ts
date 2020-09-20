import { Observable } from 'rxjs/internal/Observable'
import { skip, take } from 'rxjs/operators'
import { Atom } from './types'

const observeForOneValue = <T>(atom: Atom<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const unsubscribe = atom.subscribe(value => {
      observer.next(value)
    })
    return () => {
      unsubscribe()
    }
  }).pipe(skip(1), take(1))
}

export default observeForOneValue
