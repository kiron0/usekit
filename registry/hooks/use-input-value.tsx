import * as React from "react"

export function useInputValue(initialValue: string) {
  const [value, setValue] = React.useState(initialValue)

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value)
  }

  return {
    value,
    onChange,
  }
}
