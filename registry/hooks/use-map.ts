import * as React from "react"

class ReactiveMap<K, V> extends Map<K, V> {
  private reRender: () => void

  constructor(reRender: () => void, entries?: Iterable<[K, V]>) {
    super(entries || [])
    this.reRender = reRender
  }

  set(key: K, value: V): this {
    super.set(key, value)
    this.reRender()
    return this
  }

  delete(key: K): boolean {
    const result = super.delete(key)
    this.reRender()
    return result
  }

  clear(): void {
    super.clear()
    this.reRender()
  }
}

export function useMap<K, V>(initialState?: Iterable<[K, V]>): Map<K, V> {
  const [, reRender] = React.useReducer((x) => x + 1, 0)

  const mapRef = React.useRef<ReactiveMap<K, V> | null>(null)

  if (!mapRef.current) {
    mapRef.current = new ReactiveMap(reRender, initialState || [])
  }

  return mapRef.current
}
