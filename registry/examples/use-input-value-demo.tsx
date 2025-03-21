"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInputValue } from "registry/hooks/use-input-value"

export default function UseInputValueDemo() {
  const name = useInputValue("useKit")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="Enter your name" {...name} />
      </div>
      <p>Hello, {name.value}!</p>
    </div>
  )
}
