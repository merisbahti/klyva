import * as React from 'react'

const { useEffect, useReducer } = React

const useTransition = React.unstable_useTransition

let skipCount = 0

// block for about 20 ms
export const syncBlock = () => {
  skipCount += 1
  if (skipCount % 10 === 0) {
    // just one tenth, auto click the increment button
    const count = document.getElementById('autoIncrementCount')?.value
    if (count > 0) {
      document.getElementById('autoIncrementCount').value = count - 1
      document.getElementById('remoteIncrement').click()
      return
    }
  }
  const start = performance.now()
  while (performance.now() - start < 20) {
    // empty
  }
}

export const useRegisterIncrementDispatcher = listener => {
  useEffect(() => {
    const ele = document.getElementById('remoteIncrement')
    console.log(ele)
    if (ele) {
      ele.addEventListener('click', listener)
      return () => {
        ele.removeEventListener('click', listener)
      }
    }
  }, [listener])
}

export const COUNT_PER_DUMMY = 2

export const initialState = {
  count: 0,
  dummy: 0,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        dummy: state.dummy + 1,
        count:
          state.dummy % COUNT_PER_DUMMY === COUNT_PER_DUMMY - 1
            ? state.count + 1
            : state.count,
      }
    case 'double':
      return {
        ...state,
        count: state.count * 2,
      }
    default:
      return state
  }
}

export const selectCount = state => state.count
export const incrementAction = { type: 'increment' }
export const doubleAction = { type: 'double' }

export const NUM_CHILD_COMPONENTS = 50
export const ids = [...Array(50)].map((_, i) => i)

// check if all child components show the same count
// and if not, change the title
export const useCheckTearing = () => {
  useEffect(() => {
    const counts = ids.map(i =>
      Number(document.querySelector(`.count:nth-of-type(${i + 1})`).innerHTML),
    )
    counts.push(Number(document.getElementById('mainCount').innerHTML))
    if (!counts.every(c => c === counts[0])) {
      console.error('count mismatch', counts)
      document.title += ' TEARED'
    }
  })
}

export const createApp = (
  useCount: () => number,
  useIncrement: () => () => void,
  useDouble: () => () => void,
  Root = React.Fragment,
) => {
  const Counter = React.memo(() => {
    const count = useCount()
    syncBlock()
    return <div className="count">{count}</div>
  })

  const Main = () => {
    const count = useCount()
    useCheckTearing()
    const [startTransition, isPending] = useTransition()
    const increment = useIncrement()
    useRegisterIncrementDispatcher(increment)
    const doDouble = useDouble()
    const [localState, localDispatch] = useReducer(reducer, initialState)
    const normalDouble = () => {
      doDouble()
    }
    const transitionIncrement = () => {
      startTransition(() => {
        increment()
      })
    }
    return (
      <div>
        <button type="button" id="normalDouble" onClick={normalDouble}>
          Double shared count normally
        </button>
        <button
          type="button"
          id="transitionIncrement"
          onClick={transitionIncrement}
        >
          Increment shared count in transition ({COUNT_PER_DUMMY}
          clicks to increment one)
        </button>
        <span id="pending">{isPending && 'Pending...'}</span>
        <h1>Shared Count</h1>
        {ids.map(id => (
          <Counter key={id} />
        ))}
        <div id="mainCount" className="count">
          {count}
        </div>
        <h1>Local Count</h1>
        <div id="localCount">{localState.count}</div>
        <div id="localDummy">{localState.dummy}</div>
        <button
          type="button"
          id="localIncrement"
          onClick={() => localDispatch(incrementAction)}
        >
          Increment local count
        </button>
      </div>
    )
  }

  const App = () => (
    <Root>
      <Main />
    </Root>
  )

  return App
}
