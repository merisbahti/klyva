import * as z from 'zod'
export const FilterTypeIO = z.union([
  z.literal('uncompleted'),
  z.literal('completed'),
  z.literal('all'),
])
export const TodoTypeIO = z.object({ task: z.string(), checked: z.boolean() })
export const TodoListTypeIO = z.object({
  filter: FilterTypeIO,
  todos: z.array(TodoTypeIO),
})
export type TodoType = z.infer<typeof TodoTypeIO>
export type FilterType = z.infer<typeof FilterTypeIO>
export type TodoListAtomType = z.infer<typeof TodoListTypeIO>
