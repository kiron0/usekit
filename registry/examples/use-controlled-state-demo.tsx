"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { useControlledState } from "registry/hooks/use-controlled-state"

export default function UseControlledStateDemo() {
  const [value, setValue] = React.useState("")

  return <ControlledInput value={value} onChange={setValue} />
}

function ControlledInput({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) {
  const [inputValue, setInputValue] = useControlledState({
    prop: value,
    defaultProp: "",
    onChange,
  })

  return (
    <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4 text-center">
      <p>Controlled state: {value}</p>
      <Input
        type="text"
        value={inputValue ?? ""}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type here..."
        className="w-full"
      />
    </div>
  )
}
