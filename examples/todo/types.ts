export type TodoType = {
  task: string
  checked: boolean
}
export type FilterType = 'active' | 'completed' | 'all'
export type TodoAppType = {
  filter: FilterType
  todos: TodoType[]
}
