import * as React from "react"

interface CookieOptions {
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
}

export function useCookieStorage<T>(
  key: string,
  initialValue: T,
  options?: CookieOptions
): [T, (value: T | ((prev: T) => T)) => void] {
  const [cookieState, setCookieState] = React.useState<T>(initialValue)

  const updateCookie = React.useCallback(
    (value: T) => {
      const serializedValue = JSON.stringify(value)
      const encodedValue = encodeURIComponent(serializedValue)

      let cookieString = `${key}=${encodedValue}`

      if (options?.expires) {
        cookieString += `; expires=${options.expires.toUTCString()}`
      }
      if (options?.path) {
        cookieString += `; path=${options.path}`
      }
      if (options?.domain) {
        cookieString += `; domain=${options.domain}`
      }
      if (options?.secure) {
        cookieString += "; secure"
      }
      if (options?.sameSite) {
        cookieString += `; samesite=${options.sameSite}`
      }

      document.cookie = cookieString
      setCookieState(value)
    },
    [key, options]
  )

  React.useEffect(() => {
    const readCookie = () => {
      const cookies = document.cookie.split("; ")
      const cookie = cookies.find((c) => c.startsWith(`${key}=`))

      if (cookie) {
        const encodedValue = cookie.split("=").slice(1).join("=")
        try {
          const decodedValue = decodeURIComponent(encodedValue)
          const parsedValue = JSON.parse(decodedValue) as T
          setCookieState(parsedValue)
        } catch (error) {
          console.error("Error parsing cookie value:", error)
          updateCookie(initialValue)
        }
      } else {
        updateCookie(initialValue)
      }
    }

    readCookie()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setCookie = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      const newValue = value instanceof Function ? value(cookieState) : value
      updateCookie(newValue)
    },
    [cookieState, updateCookie]
  )

  return [cookieState, setCookie]
}
