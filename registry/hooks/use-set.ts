import * as React from "react"

export function useSet<T>(values?: T[]): Set<T> {
  const setRef = React.useRef<Set<T>>(new Set(values))
  const [, reRender] = React.useReducer((x) => x + 1, 0)

  setRef.current.add = (...args: Parameters<Set<T>["add"]>) => {
    const res = Set.prototype.add.apply(setRef.current, args)
    reRender()
    return res
  }

  setRef.current.clear = (...args: Parameters<Set<T>["clear"]>) => {
    Set.prototype.clear.apply(setRef.current, args)
    reRender()
  }

  setRef.current.delete = (...args: Parameters<Set<T>["delete"]>) => {
    const res = Set.prototype.delete.apply(setRef.current, args)
    reRender()
    return res
  }

  return setRef.current
}
