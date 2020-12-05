import * as io from 'io-ts'
export const FilterTypeIO = io.union([
  io.literal('uncompleted'),
  io.literal('completed'),
  io.literal('all'),
])
export const TodoTypeIO = io.type({ task: io.string, checked: io.boolean })
export const TodoListTypeIO = io.type({
  filter: FilterTypeIO,
  todos: io.array(TodoTypeIO),
})
export type TodoType = typeof TodoTypeIO._A
export type FilterType = typeof FilterTypeIO._A
export type TodoListAtomType = typeof TodoListTypeIO._A
