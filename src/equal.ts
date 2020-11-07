import deepEqual from 'deep-equal'

const equal = (l1: any, l2: any) => {
  return deepEqual(l1, l2, { strict: true })
}

export default equal
