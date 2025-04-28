import * as React from "react"

export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean,
  autoFocusSelector?: string
) {
  const containerRef = React.useRef<T | null>(null)
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!isActive) return

    previouslyFocusedElement.current = document.activeElement as HTMLElement

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      'input[type="text"]:not([disabled])',
      'input[type="email"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ]

    const getFocusableElements = () => {
      if (!containerRef.current) return []
      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          focusableSelectors.join(",")
        )
      )
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    const timeout = setTimeout(() => {
      if (autoFocusSelector && containerRef.current) {
        const autoFocusElement =
          containerRef.current.querySelector<HTMLElement>(autoFocusSelector)
        if (autoFocusElement) {
          autoFocusElement.focus()
          return
        }
      }
      const focusableElements = getFocusableElements()
      focusableElements[0]?.focus()
    }, 0)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener("keydown", handleKeyDown)
      previouslyFocusedElement.current?.focus()
    }
  }, [isActive, autoFocusSelector])

  return containerRef
}
