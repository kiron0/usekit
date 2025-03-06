"use client"

import * as React from "react"
import { Trash } from "lucide-react"
import { useHistoryState } from "registry/hooks/use-history-state"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TodoItem {
  id: string
  name: string
}

export default function UseHistoryStateDemo() {
  const { state, set, undo, redo, clear, canUndo, canRedo } = useHistoryState<{
    items: TodoItem[]
  }>({ items: [] })

  const addTodo = (val: string) => {
    set({
      ...state,
      items: [...state.items, { id: crypto.randomUUID(), name: val }],
    })
  }

  const removeTodo = (id: string) => {
    set({
      ...state,
      items: state.items.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-5 w-full">
      <div className="w-full space-y-5">
        <div className="flex items-center gap-3">
          <Button disabled={!canUndo} onClick={undo}>
            Undo
          </Button>
          <Button disabled={!canRedo} onClick={redo}>
            Redo
          </Button>
          <Button disabled={!state.items.length} onClick={clear}>
            Clear
          </Button>
        </div>
        <Form addItem={addTodo} />
      </div>
      <div className="w-full space-y-2">
        {state.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-md border px-2 py-2"
          >
            <span>{item.name}</span>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeTodo(item.id)}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

interface FormProps {
  addItem: (val: string) => void
}

function Form({ addItem }: FormProps) {
  const [input, setInput] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    addItem(input)
    setInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter todo"
      />
      <Button type="submit" disabled={!input.trim()}>
        Add
      </Button>
    </form>
  )
}
