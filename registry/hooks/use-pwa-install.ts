"use client"

import * as React from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

const PROMPT_COUNT_KEY = "usekit:pwa-install:prompt-count"
const LAST_PROMPT_KEY = "usekit:pwa-install:last-prompt"

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ??
    (window.navigator as any)?.standalone === true
  )
}

function readPromptCount(): number {
  if (typeof window === "undefined") return 0
  const raw = window.localStorage.getItem(PROMPT_COUNT_KEY)
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : 0
}

function incrementPromptCount(): number {
  if (typeof window === "undefined") return 0
  const next = readPromptCount() + 1
  window.localStorage.setItem(PROMPT_COUNT_KEY, String(next))
  window.localStorage.setItem(LAST_PROMPT_KEY, String(Date.now()))
  return next
}

export interface UsePWAInstallReturn {
  canInstall: boolean
  isInstalled: boolean
  promptCount: number
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">
}

export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(isStandaloneDisplay())
  const [promptCount, setPromptCount] = React.useState(readPromptCount)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const bipEvent = event as BeforeInstallPromptEvent
      setDeferredPrompt(bipEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const promptInstall = React.useCallback(async () => {
    if (!deferredPrompt) {
      return "unavailable"
    }

    try {
      await deferredPrompt.prompt()
      incrementPromptCount()
      setPromptCount(readPromptCount())
      const choice = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setCanInstall(false)
      if (choice.outcome === "accepted") {
        setIsInstalled(true)
      }
      return choice.outcome
    } catch (error) {
      console.warn("[usePWAInstall] Failed to prompt for install:", error)
      return "unavailable"
    }
  }, [deferredPrompt])

  return {
    canInstall,
    isInstalled,
    promptCount,
    promptInstall,
  }
}
