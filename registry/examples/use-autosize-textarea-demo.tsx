"use client"

import * as React from "react"

import { Textarea } from "@/components/ui/textarea"
import { useAutosizeTextArea } from "registry/hooks/use-autosize-textarea"

export default function UseAutosizeTextareaDemo() {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = React.useState("")

  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 200, // Max height of 200px
    borderWidth: 1, // Account for 1px border
    dependencies: [value], // Re-run effect when value changes
  })

  return (
    <div className="w-full max-w-md">
      <Textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
        className="max-h-[200px] w-full resize-none"
      />
    </div>
  )
}
