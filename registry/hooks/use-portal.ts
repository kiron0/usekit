import * as React from "react"
import * as ReactDOM from "react-dom"

export function usePortal() {
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    const portalRoot = (() => {
      const el = document.createElement("div")
      document.body.appendChild(el)
      return el
    })()

    setContainer(portalRoot)

    return () => {
      if (portalRoot.parentNode) {
        portalRoot.parentNode.removeChild(portalRoot)
      }
    }
  }, [])

  const Portal = React.useCallback(
    ({ children }: { children: React.ReactNode }) =>
      container ? ReactDOM.createPortal(children, container) : null,
    [container]
  )

  return { Portal, container }
}
