"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notifySuccess } from "@/components/toast"
import { useMergeRefs } from "registry/hooks/use-merge-refs"

const MAX_LENGTH = 30

export default function UseMergeRefsDemo() {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const focusRef = React.useRef<HTMLInputElement>(null)
  const validationRef = React.useRef<HTMLInputElement>(null)

  const mergedRef = useMergeRefs<HTMLInputElement>(
    focusRef,
    validationRef,
    (el) => {
      if (el) {
        console.log("Input mounted:", el)
      } else {
        console.log("Input unmounted")
      }
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (newValue.length > MAX_LENGTH) {
      setError(`Input exceeds ${MAX_LENGTH} characters`)
    } else if (newValue.length === 0) {
      setError("Input cannot be empty")
    } else {
      setError(null)
    }
  }

  const handleFocus = () => {
    focusRef.current?.focus()
  }

  const handleClear = () => {
    setValue("")
    setError(null)
    focusRef.current?.focus()
  }

  const handleSubmit = () => {
    if (!error && value) {
      notifySuccess({
        description: `Submitted: ${value}`,
      })
    }
  }

  const charCountColor = React.useMemo(() => {
    const ratio = value.length / MAX_LENGTH
    if (ratio > 0.8) return "text-red-500"
    if (ratio > 0.5) return "text-yellow-500"
    return "text-green-500"
  }, [value.length])

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="relative">
        <Input
          ref={mergedRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter your message..."
          className={cn(
            "w-full pe-16 transition-all duration-300",
            error ? "border-destructive" : ""
          )}
        />
        <span
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold transition-colors duration-300",
            charCountColor
          )}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      {error && (
        <p className="animate-pulse text-sm text-destructive">{error}</p>
      )}
      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={handleFocus}>
          Focus
        </Button>
        <Button variant="destructive" onClick={handleClear} disabled={!value}>
          Clear
        </Button>
        <Button onClick={handleSubmit} disabled={!!error || !value}>
          Submit
        </Button>
      </div>
    </div>
  )
}
