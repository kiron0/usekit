"use client"

import * as React from "react"

export interface UseAdaptiveLanguageOptions {
  supportedLocales: string[]
  defaultLocale?: string
  storageKey?: string
  persist?: boolean
  detectBrowserLocale?: boolean
}

export interface UseAdaptiveLanguageReturn {
  locale: string
  setLocale: (locale: string) => void
  isSupported: (locale: string) => boolean
}

const DEFAULT_STORAGE_KEY = "usekit:locale"

function detectBrowserLocale(supportedLocales: string[]): string | null {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null
  }

  const browserLang = navigator.language || navigator.languages?.[0]
  if (browserLang) {
    if (supportedLocales.includes(browserLang)) {
      return browserLang
    }

    const langCode = browserLang.split("-")[0]
    const matched = supportedLocales.find((loc) => loc.startsWith(langCode))
    if (matched) {
      return matched
    }
  }

  return null
}

export function useAdaptiveLanguage(
  options: UseAdaptiveLanguageOptions
): UseAdaptiveLanguageReturn {
  const {
    supportedLocales,
    defaultLocale,
    storageKey = DEFAULT_STORAGE_KEY,
    persist = true,
    detectBrowserLocale: shouldDetect = true,
  } = options

  const validLocales = React.useMemo(() => {
    return Array.from(new Set(supportedLocales)).filter(Boolean)
  }, [supportedLocales])

  if (validLocales.length === 0) {
    throw new Error(
      "useAdaptiveLanguage: supportedLocales must contain at least one locale"
    )
  }

  const getInitialLocale = React.useCallback((): string => {
    if (persist && typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(storageKey)
        if (stored && validLocales.includes(stored)) {
          return stored
        }
      } catch {}
    }

    if (defaultLocale && validLocales.includes(defaultLocale)) {
      return defaultLocale
    }

    if (shouldDetect) {
      const detected = detectBrowserLocale(validLocales)
      if (detected) {
        return detected
      }
    }

    return validLocales[0]!
  }, [validLocales, defaultLocale, storageKey, persist, shouldDetect])

  const [locale, setLocaleState] = React.useState<string>(getInitialLocale)

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }
  }, [locale])

  React.useEffect(() => {
    if (!persist || typeof window === "undefined") return

    try {
      window.localStorage.setItem(storageKey, locale)
    } catch {}
  }, [locale, storageKey, persist])

  React.useEffect(() => {
    if (!persist || typeof window === "undefined") return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        const newLocale = event.newValue
        if (validLocales.includes(newLocale)) {
          setLocaleState(newLocale)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [storageKey, persist, validLocales])

  const setLocale = React.useCallback(
    (newLocale: string) => {
      if (!validLocales.includes(newLocale)) {
        console.warn(
          `useAdaptiveLanguage: Locale "${newLocale}" is not in supported locales: ${validLocales.join(", ")}`
        )
        return
      }
      setLocaleState(newLocale)
    },
    [validLocales]
  )

  const isSupported = React.useCallback(
    (loc: string) => validLocales.includes(loc),
    [validLocales]
  )

  return {
    locale,
    setLocale,
    isSupported,
  }
}
