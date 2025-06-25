import * as React from "react"

export function useUpdateEffect(
  callback: () => void,
  dependencies: any[]
): void {
  const isFirstRender = React.useRef(true)

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
