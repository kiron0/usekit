import * as React from "react"

interface CookieOptions {
  days?: number
  expires?: Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
}

function setCookie<T>(
  name: string,
  value: T,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") return

  try {
    const serializedValue = JSON.stringify(value)
    const encodedValue = encodeURIComponent(serializedValue)
    let cookieString = `${name}=${encodedValue}`

    if (options.days) {
      const expires = new Date()
      expires.setDate(expires.getDate() + options.days)
      cookieString += `; expires=${expires.toUTCString()}`
    } else if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    }

    if (options.maxAge != null) {
      cookieString += `; max-age=${options.maxAge}`
    }

    cookieString += `; path=${options.path || "/"}`

    if (options.domain) cookieString += `; domain=${options.domain}`
    if (options.secure) cookieString += "; secure"
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`

    document.cookie = cookieString
  } catch (error) {
    console.error("Error setting cookie:", error)
  }
}

function getCookie<T>(name: string): T | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split("=")
    if (cookieName === name) {
      try {
        const decodedValue = decodeURIComponent(rest.join("="))
        return JSON.parse(decodedValue) as T
      } catch (error) {
        console.error("Error parsing cookie:", error)
        return null
      }
    }
  }
  return null
}

export function useCookieStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: CookieOptions = {}
): [
  T,
  (value: T | ((prev: T) => T), options?: CookieOptions) => void,
  () => void,
] {
  const initialValueRef = React.useRef<T>(
    typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue
  )

  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof document === "undefined") return initialValueRef.current
    const cookieValue = getCookie<T>(key)
    return cookieValue !== null ? cookieValue : initialValueRef.current
  })

  const updateCookie = React.useCallback(
    (value: T | ((prev: T) => T), overrideOptions?: CookieOptions) => {
      const mergedOptions = { ...options, ...overrideOptions }
      const newValue =
        typeof value === "function"
          ? (value as (prev: T) => T)(storedValue)
          : value
      setCookie(key, newValue, mergedOptions)
      setStoredValue(newValue)
    },
    [key, options, storedValue]
  )

  const removeCookie = React.useCallback(() => {
    setCookie(key, "", { ...options, expires: new Date(0) })
    setStoredValue(initialValueRef.current)
  }, [key, options])

  return [storedValue, updateCookie, removeCookie]
}
