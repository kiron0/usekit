"use client"

import * as React from "react"

type SetStateAction<T> = T | ((prevState: T) => T)

export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: SetStateAction<T>) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item
        ? JSON.parse(item)
        : typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    }
  })

  const setValue = React.useCallback(
    (value: SetStateAction<T>) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const handleStorageChange = React.useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.storageArea === sessionStorage) {
        try {
          const newValue = event.newValue
            ? JSON.parse(event.newValue)
            : typeof initialValue === "function"
              ? (initialValue as () => T)()
              : initialValue

          setStoredValue(newValue)
        } catch (error) {
          console.error(
            `Error parsing new sessionStorage value for key "${key}":`,
            error
          )
        }
      }
    },
    [key, initialValue]
  )

  React.useEffect(() => {
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [handleStorageChange])

  return [storedValue, setValue]
}
