"use client"

import * as React from "react"
import { siteName } from "@/utils"

import { Input } from "@/components/ui/input"
import { useUncontrolledState } from "registry/hooks/use-uncontrolled-state"

export default function UseUncontrolledStateDemo() {
  const [console, setConsole] = React.useState<string[]>([])
  const [value, setValue] = useUncontrolledState({
    defaultProp: siteName,
    onChange: (newValue) => setConsole((prev) => [...prev, newValue]),
  })

  return (
    <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4 text-center">
      <p>Uncontrolled state: {value}</p>
      <Input
        type="text"
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here..."
      />
      {console.length > 0 && (
        <p className="text-sm">
          {console.map((item, index) => (
            <span key={index}>
              <span className="text-primary">{item}</span>
              {index < console.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
