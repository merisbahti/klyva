import fastDeepEqual from 'fast-deep-equal'

export const equal = (l1: any, l2: any) => {
  return fastDeepEqual(l1, l2)
}
