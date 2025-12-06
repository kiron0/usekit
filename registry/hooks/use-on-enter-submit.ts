import * as React from "react"

export interface UseOnEnterSubmitOptions {
  preventDefault?: boolean
  checkValidity?: boolean
}

export function useOnEnterSubmit(
  ref: React.RefObject<
    HTMLFormElement | HTMLInputElement | HTMLTextAreaElement | null
  >,
  submit: () => void,
  options: UseOnEnterSubmitOptions = {}
): void {
  const { preventDefault = true, checkValidity = true } = options

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleKeyDown = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent
      if (
        keyboardEvent.key !== "Enter" ||
        keyboardEvent.shiftKey ||
        keyboardEvent.ctrlKey ||
        keyboardEvent.metaKey ||
        keyboardEvent.altKey
      ) {
        return
      }

      if (element instanceof HTMLTextAreaElement) {
        return
      }

      const form =
        element instanceof HTMLFormElement ? element : element.closest("form")

      if (!form) return

      if (checkValidity) {
        const isValid = form.checkValidity()
        if (!isValid) {
          form.reportValidity()
          return
        }
      }

      if (preventDefault) {
        keyboardEvent.preventDefault()
      }

      submit()
    }

    element.addEventListener("keydown", handleKeyDown)

    return () => {
      element.removeEventListener("keydown", handleKeyDown)
    }
  }, [ref, submit, preventDefault, checkValidity])
}
