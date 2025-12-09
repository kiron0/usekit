"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useOptimisticQueue } from "registry/hooks/use-optimistic-queue"

interface Todo {
  id: string
  text: string
}

export default function UseOptimisticQueueDemo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const { enqueue, confirm, rollback, pending, size } =
    useOptimisticQueue<Todo>()

  const handleAddTodo = () => {
    const newTodo: Todo = {
      id: `temp-${Date.now()}`,
      text: `Todo ${todos.length + 1}`,
    }

    const actionId = enqueue(newTodo, () => {
      setTodos((prev) => prev.filter((todo) => todo.id !== newTodo.id))
    })

    setTodos((prev) => [...prev, newTodo])

    setTimeout(() => {
      if (Math.random() > 0.3) {
        confirm(actionId)
      } else {
        rollback(actionId)
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Optimistic Todo Queue</h2>
        <div className="text-sm text-muted-foreground">
          {size} pending action{size !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Todos ({todos.length})</h3>
        {todos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No todos yet</p>
        ) : (
          <ul className="space-y-1">
            {todos.map((todo) => {
              const isPending = pending.some((p) => p.action.id === todo.id)
              return (
                <li
                  key={todo.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-2",
                    isPending
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                      : "border-border"
                  )}
                >
                  <span
                    className={
                      isPending ? "text-yellow-700 dark:text-yellow-300" : ""
                    }
                  >
                    {todo.text}
                    {isPending && (
                      <span className="ml-2 text-xs">
                        (pending confirmation)
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Button onClick={handleAddTodo} disabled={size > 0}>
        Add Todo (Optimistic)
      </Button>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Click &quot;Add Todo&quot; to enqueue an optimistic update. After 2
          seconds, it will either be confirmed (kept) or rolled back (removed)
          randomly.
        </p>
      </div>
    </div>
  )
}
