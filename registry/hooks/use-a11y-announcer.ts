import * as React from "react"

export type PolitenessSetting = "polite" | "assertive"

interface A11yAnnouncer {
  announce: (text: string, politeness?: PolitenessSetting) => void
}

export function useA11yAnnouncer(): A11yAnnouncer {
  const politeRef = React.useRef<HTMLDivElement | null>(null)
  const assertiveRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const politeNode = document.createElement("div")
    politeNode.setAttribute("aria-live", "polite")
    politeNode.setAttribute("aria-atomic", "true")
    politeNode.style.position = "absolute"
    politeNode.style.width = "1px"
    politeNode.style.height = "1px"
    politeNode.style.margin = "-1px"
    politeNode.style.border = "0"
    politeNode.style.padding = "0"
    politeNode.style.overflow = "hidden"
    politeNode.style.clip = "rect(0 0 0 0)"

    const assertiveNode = politeNode.cloneNode() as HTMLDivElement
    assertiveNode.setAttribute("aria-live", "assertive")

    politeRef.current = politeNode
    assertiveRef.current = assertiveNode

    document.body.appendChild(politeNode)
    document.body.appendChild(assertiveNode)

    return () => {
      politeNode.remove()
      assertiveNode.remove()
    }
  }, [])

  const announce = React.useCallback(
    (text: string, politeness: PolitenessSetting = "polite") => {
      const target =
        politeness === "assertive" ? assertiveRef.current : politeRef.current
      if (!target) return

      target.textContent = ""
      target.textContent = text
    },
    []
  )

  return { announce }
}
