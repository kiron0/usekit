import * as React from "react"

type Keyed<T> = T extends object
  ? T & { _key: string }
  : { value: T; _key: string }

interface Options<T> {
  getKey?: (item: T, index: number) => string
}

export function useKeyedArray<T>(items: T[], options?: Options<T>): Keyed<T>[] {
  const { getKey } = options || {}
  const keyMapRef = React.useRef(new WeakMap<object, string>())
  const counterRef = React.useRef(0)

  return items.map((item, index) => {
    let key: string

    if (typeof item === "object" && item !== null) {
      const existing = keyMapRef.current.get(item)
      if (existing) {
        key = existing
      } else {
        key = getKey?.(item, index) ?? `key-${counterRef.current++}`
        keyMapRef.current.set(item, key)
      }
      return { ...(item as object), _key: key } as Keyed<T>
    } else {
      key = getKey?.(item, index) ?? `key-${counterRef.current++}`
      return { value: item, _key: key } as Keyed<T>
    }
  })
}
