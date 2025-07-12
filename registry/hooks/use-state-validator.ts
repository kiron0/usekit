import * as React from "react"
import { z, ZodTypeAny } from "zod"

type Validator<T> = (
  value: T
) =>
  | boolean
  | string
  | null
  | undefined
  | Promise<boolean | string | null | undefined>
type SchemaValidator<T> =
  | ZodTypeAny
  | ((value: T) => boolean | string | null | undefined)

interface Options<T> {
  initialValue?: T | (() => T)
  validator?: Validator<T> | SchemaValidator<T>
  onInvalid?: (value: T, error: string) => void
  onValid?: (value: T) => void
  throwOnInvalid?: boolean
  asyncDebounceMs?: number
}

interface Result {
  isValid: boolean
  error?: string
  isPending?: boolean
}

export function useStateValidator<T>(
  initialValue?: T | (() => T),
  validator?: Validator<T> | SchemaValidator<T>,
  options: Options<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, Result] {
  const {
    onInvalid,
    onValid,
    throwOnInvalid = false,
    asyncDebounceMs = 300,
  } = options

  const validatorFn = React.useCallback(
    (value: T): Promise<boolean | string | null | undefined> => {
      if (!validator) return Promise.resolve(true)

      try {
        if (typeof (validator as z.ZodTypeAny)?.parse === "function") {
          const result = (validator as z.ZodTypeAny).safeParse(value)
          return Promise.resolve(
            result.success
              ? true
              : result.error.issues[0]?.message || "Invalid value"
          )
        }
        const result = (validator as Validator<T>)(value)
        return Promise.resolve(result)
      } catch (err) {
        return Promise.resolve(
          err instanceof Error ? err.message : "Validation error"
        )
      }
    },
    [validator]
  )

  const [state, setState] = React.useState<T>(initialValue as T)
  const [validation, setValidation] = React.useState<Result>({
    isValid: true,
    isPending: false,
  })
  const validationTimeout = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const validate = async () => {
      try {
        const result = await validatorFn(state)
        const isValid = result === true
        const error = typeof result === "string" ? result : undefined

        setValidation({ isValid, error, isPending: false })
        if (isValid) {
          onValid?.(state)
        } else {
          onInvalid?.(state, error || "Invalid value")
        }
      } catch (err) {
        console.error("Initial validation failed:", err)
      }
    }

    validate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const safeSetState = React.useCallback<
    React.Dispatch<React.SetStateAction<T>>
  >(
    async (value) => {
      try {
        const newValue =
          typeof value === "function" ? (value as (prev: T) => T)(state) : value

        setState(newValue)
        setValidation((prev) => ({ ...prev, isPending: true }))

        if (validationTimeout.current) {
          clearTimeout(validationTimeout.current)
        }

        validationTimeout.current = setTimeout(async () => {
          try {
            const result = await validatorFn(newValue)
            const isValid = result === true
            const error = typeof result === "string" ? result : undefined

            setValidation({ isValid, error, isPending: false })

            if (isValid) {
              onValid?.(newValue)
            } else {
              onInvalid?.(newValue, error || "Invalid value")
              if (throwOnInvalid) {
                throw new Error(error || "Invalid state update")
              }
            }
          } catch (err) {
            console.error("Validation failed:", err)
            setValidation({
              isValid: false,
              error: err instanceof Error ? err.message : "Validation error",
              isPending: false,
            })
            if (throwOnInvalid) throw err
          }
        }, asyncDebounceMs)
      } catch (err) {
        console.error("State update failed:", err)
        if (throwOnInvalid) throw err
      }
    },
    [state, validatorFn, onInvalid, onValid, throwOnInvalid, asyncDebounceMs]
  )

  React.useEffect(() => {
    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current)
      }
    }
  }, [])

  return [state, safeSetState, validation]
}

export function useZodStateValidator<T>(
  schema: ZodTypeAny,
  options?: Omit<Options<T>, "validator">
) {
  return useStateValidator<T>(undefined, schema, options)
}

export function useDebouncedStateValidator<T>(
  validator: Validator<T>,
  debounceMs: number = 300,
  options?: Omit<Options<T>, "validator" | "asyncDebounceMs">
) {
  return useStateValidator<T>(undefined, validator, {
    ...options,
    asyncDebounceMs: debounceMs,
  })
}
