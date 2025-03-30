import * as React from "react"

export function useLogger(name: string, ...rest: any[]): void {
  const currentRestRef = React.useRef(rest)
  currentRestRef.current = rest

  React.useEffect(() => {
    console.log(`${name} mounted`, ...currentRestRef.current)
    return () => {
      console.log(`${name} unmounted`, ...currentRestRef.current)
    }
  }, [name])

  React.useEffect(() => {
    console.log(`${name} updated`, ...rest)
  }, [name, rest])
}
