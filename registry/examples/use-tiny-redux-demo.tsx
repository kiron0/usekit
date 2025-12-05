"use client"

import { Minus, Plus, RotateCcw, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  createTinyReduxStore,
  useTinyRedux,
} from "registry/hooks/use-tiny-redux"

interface TinyState {
  count: number
  userName: string
}

const tinyStore = createTinyReduxStore<TinyState>({
  count: 0,
  userName: "Ada Lovelace",
})

function CounterPanel() {
  const { state, set } = useTinyRedux(tinyStore)

  return (
    <div className="space-y-3 rounded-md border bg-muted/40 p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">Global counter</span>
        <Badge variant="outline" className="text-[0.65rem]">
          {state.count}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => set((prev) => ({ ...prev, count: prev.count - 1 }))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => set((prev) => ({ ...prev, count: prev.count + 1 }))}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          disabled={state.count === 0}
          onClick={() => set((prev) => ({ ...prev, count: 0 }))}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Updates propagate to any component using the same tiny store, no context
        provider required.
      </p>
    </div>
  )
}

function UserPanel() {
  const { state, set } = useTinyRedux(tinyStore, {
    selector: (s) => s,
  })

  return (
    <div className="space-y-3 rounded-md border bg-background p-3 text-sm">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">User profile</span>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Any change here goes through the same tiny store as the counter.</p>
      </div>
      <Input
        value={state.userName}
        onChange={(event) =>
          set((prev) => ({ ...prev, userName: event.target.value }))
        }
        className="h-8"
      />
      <p className="text-xs text-muted-foreground">
        Hello,{" "}
        <span className="font-medium text-foreground">{state.userName}</span>.
      </p>
    </div>
  )
}

export default function UseTinyReduxDemo() {
  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 text-sm">
            Tiny Redux Store
          </CardTitle>
          <CardDescription>
            Minimal global state with <code>get</code>, <code>set</code>, and{" "}
            <code>subscribe</code> power, hooked into React via{" "}
            <code>useTinyRedux</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-3 md:grid-cols-2">
            <CounterPanel />
            <UserPanel />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
