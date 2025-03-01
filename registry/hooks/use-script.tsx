"use client"

import * as React from "react"

type ScriptStatus = "loading" | "ready" | "error" | "unknown"

interface UseScriptOptions {
  removeOnUnmount?: boolean
}

export function useScript(
  src: string,
  options?: UseScriptOptions
): ScriptStatus {
  const [status, setStatus] = React.useState<ScriptStatus>(() => {
    if (typeof document === "undefined") {
      return "loading"
    }
    const existingScript = document.querySelector(`script[src="${src}"]`)
    return existingScript ? "unknown" : "loading"
  })

  React.useEffect(() => {
    let script: HTMLScriptElement | null = document.querySelector(
      `script[src="${src}"]`
    )

    if (!script) {
      script = document.createElement("script")
      script.src = src
      script.async = true
      script.setAttribute("data-use-script", "true")
      document.body.appendChild(script)

      const setAttributeStatus = (event: Event) => {
        setStatus(event.type === "load" ? "ready" : "error")
      }

      script.addEventListener("load", setAttributeStatus)
      script.addEventListener("error", setAttributeStatus)
    }

    return () => {
      if (options?.removeOnUnmount && script?.getAttribute("data-use-script")) {
        script.remove()
      }
    }
  }, [src, options?.removeOnUnmount])

  return status
}
