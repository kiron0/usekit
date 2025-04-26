import * as React from "react"

type ScriptStatus = "loading" | "ready" | "error" | "unknown"

interface Options {
  removeOnUnmount?: boolean
  customAttributes?: Record<string, string>
}

export function useScript(src: string, options?: Options): ScriptStatus {
  const [status, setStatus] = React.useState<ScriptStatus>(() => {
    if (typeof document === "undefined") {
      return "loading"
    }
    const existingScript = document.querySelector(`script[src="${src}"]`)
    return existingScript ? "unknown" : "loading"
  })

  const optionsRef = React.useRef(options)
  React.useEffect(() => {
    optionsRef.current = options
  }, [options])

  React.useEffect(() => {
    let script: HTMLScriptElement | null = document.querySelector(
      `script[src="${src}"]`
    )
    const domStatus = script?.getAttribute("data-status")

    if (domStatus) {
      setStatus(domStatus as ScriptStatus)
      return
    }

    let removeEventListeners: () => void = () => {}

    if (script) {
      const handleScriptLoad = () => {
        script?.setAttribute("data-status", "ready")
        setStatus("ready")
        removeEventListeners()
      }

      const handleScriptError = () => {
        script?.setAttribute("data-status", "error")
        setStatus("error")
        removeEventListeners()
      }

      removeEventListeners = () => {
        script?.removeEventListener("load", handleScriptLoad)
        script?.removeEventListener("error", handleScriptError)
      }

      script.addEventListener("load", handleScriptLoad)
      script.addEventListener("error", handleScriptError)
    } else {
      script = document.createElement("script")
      script.src = src
      script.async = true
      script.setAttribute("data-status", "loading")

      const customAttributes = optionsRef.current?.customAttributes ?? {}
      for (const [key, value] of Object.entries(customAttributes)) {
        script.setAttribute(key, value)
      }

      document.body.appendChild(script)

      const handleScriptLoad = () => {
        script?.setAttribute("data-status", "ready")
        setStatus("ready")
        removeEventListeners()
      }

      const handleScriptError = () => {
        script?.setAttribute("data-status", "error")
        setStatus("error")
        removeEventListeners()
      }

      removeEventListeners = () => {
        script?.removeEventListener("load", handleScriptLoad)
        script?.removeEventListener("error", handleScriptError)
      }

      script.addEventListener("load", handleScriptLoad)
      script.addEventListener("error", handleScriptError)
    }

    return () => {
      removeEventListeners()
      if (
        script &&
        optionsRef.current?.removeOnUnmount &&
        !document.querySelector(`script[src="${src}"]`)
      ) {
        script.remove()
      }
    }
  }, [src])

  return status
}
