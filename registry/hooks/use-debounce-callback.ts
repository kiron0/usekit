import * as React from "react"
import debounce from "lodash.debounce"

import { useUnmount } from "./use-unmount"

interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

interface ControlFunctions {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const isPendingRef = React.useRef(false)

  useUnmount(() => {
    isPendingRef.current = false
  })

  const debounced = React.useMemo(() => {
    const debouncedFuncInstance = debounce(
      (...args: Parameters<T>) => {
        isPendingRef.current = false
        return func(...args)
      },
      delay,
      options
    )

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      isPendingRef.current = true
      return debouncedFuncInstance(...args)
    }

    wrappedFunc.cancel = () => {
      isPendingRef.current = false
      debouncedFuncInstance.cancel()
    }

    wrappedFunc.isPending = () => {
      return isPendingRef.current
    }

    wrappedFunc.flush = () => {
      isPendingRef.current = false
      return debouncedFuncInstance.flush()
    }

    return wrappedFunc
  }, [func, delay, options])

  React.useEffect(() => {
    return () => {
      debounced.cancel()
    }
  }, [debounced])

  return debounced
}
