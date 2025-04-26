import * as React from "react"

interface RenderCountReturn {
  count: number
  isStrictMode: boolean
}

export function useRenderCount(): RenderCountReturn {
  const renderCount = React.useRef(0)

  renderCount.current += 1

  const isStrictMode =
    renderCount.current % 2 === 0 && process.env.NODE_ENV === "development"

  return {
    count: renderCount.current,
    isStrictMode,
  }
}
