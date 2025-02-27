"use client"

import * as React from "react"

type UseFetchOptions = RequestInit & {
  cache?: boolean
}

type UseFetchState<T> = {
  data: T | undefined
  error: Error | undefined
  loading: boolean
}

export function useFetch<T = unknown>(
  url: string,
  options?: UseFetchOptions
): UseFetchState<T> {
  const [state, setState] = React.useState<UseFetchState<T>>({
    data: undefined,
    error: undefined,
    loading: true,
  })

  const cache = React.useRef<Map<string, T>>(new Map())

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (options?.cache && cache.current.has(url)) {
          const cachedData = cache.current.get(url)
          setState({ data: cachedData, error: undefined, loading: false })
          return
        }

        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = (await response.json()) as T

        if (options?.cache) {
          cache.current.set(url, data)
        }

        setState({ data, error: undefined, loading: false })
      } catch (error) {
        setState({ data: undefined, error: error as Error, loading: false })
      }
    }

    fetchData()
  }, [url, options])

  return state
}

export default useFetch
