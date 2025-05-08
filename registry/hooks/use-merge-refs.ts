import * as React from "react"

type RefType<T> = React.Ref<T> | null | undefined

const updateRef = <T>(ref: RefType<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && "current" in ref) {
    ;(ref as { current: T | null }).current = value
  }
}

export function useMergeRefs<T>(
  ...refs: Array<RefType<T>>
): React.RefCallback<T> {
  const refsRef = React.useRef(refs)
  refsRef.current = refs

  return React.useCallback((node: T | null) => {
    for (const ref of refsRef.current) {
      updateRef(ref, node)
    }
  }, [])
}
