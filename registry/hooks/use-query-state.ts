import * as React from "react"
import * as NextNavigation from "next/navigation"

type ParamRecord<T extends string> = Record<T, string>
export type ValidatorFn<V> = (value: string) => V | null
export type Validators<
  T extends string,
  V extends Record<T, unknown>,
> = Partial<{ [K in T]: ValidatorFn<V[K]> }>

export function useQueryState<
  T extends string,
  V extends Record<T, unknown> = Record<T, string>,
>(
  paramNames: T[],
  config: {
    defaults?: Partial<ParamRecord<T>>
    validators?: Validators<T, V> // Fixed from Validators<T, any>
    normalizeEmpty?: boolean
    suspense?: boolean
  } = {}
) {
  const {
    defaults = {} as Partial<ParamRecord<T>>,
    validators = {} as Validators<T, V>,
    normalizeEmpty = false,
    suspense = false,
  } = config

  const searchParams = NextNavigation.useSearchParams()
  const router = NextNavigation.useRouter()
  const pathname = NextNavigation.usePathname()
  const [isPending, startTransition] = React.useTransition()

  const memoizedValidators = React.useMemo<Validators<T, V>>(
    () => validators,
    [validators]
  )

  const state = React.useMemo(() => {
    const result = {} as ParamRecord<T>
    const errors: Partial<Record<T, string>> = {}

    paramNames.forEach((key) => {
      const rawValue = searchParams.get(key)
      const defaultValue = defaults[key]

      const validator = memoizedValidators[key]
      if (validator && rawValue !== null) {
        try {
          const validatedValue = validator(rawValue)
          if (validatedValue !== null) {
            result[key] = String(validatedValue)
          } else {
            errors[key] = `Invalid value for ${key}`
            result[key] = defaultValue ?? ""
          }
        } catch (error) {
          errors[key] =
            error instanceof Error
              ? error.message
              : `Validation failed for ${key}`
          result[key] = defaultValue ?? ""
        }
      } else {
        result[key] = rawValue !== null ? rawValue : (defaultValue ?? "")
      }
    })

    return { values: result, errors, hasErrors: Object.keys(errors).length > 0 }
  }, [searchParams, defaults, paramNames, memoizedValidators])

  const setState = React.useCallback(
    (
      updates: Partial<Record<T, string | null | undefined>>, // Fixed from Record<string, ...>
      options: { replace?: boolean; skipTransition?: boolean } = {}
    ) => {
      const { replace = false, skipTransition = false } = options
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, val]) => {
        if (val == null || (normalizeEmpty && val === "")) {
          params.delete(key)
        } else {
          params.set(key, String(val))
        }
      })

      const queries = params.toString()
      const url = pathname + (queries ? `?${queries}` : "")

      const updateFn = () => router[replace ? "replace" : "push"](url)

      if (suspense && !skipTransition) {
        startTransition(updateFn)
      } else {
        updateFn()
      }
    },
    [searchParams, pathname, router, normalizeEmpty, suspense]
  )

  const deleteState = React.useCallback(
    (key: T, options?: { replace?: boolean; skipTransition?: boolean }) =>
      setState(
        { [key as T]: null } as Partial<Record<T, string | null | undefined>>,
        options
      ),
    [setState]
  )

  const batchUpdate = React.useCallback(
    (
      updates: Partial<Record<T, string | null | undefined>>,
      options?: { replace?: boolean; skipTransition?: boolean }
    ) => {
      const updateEntries = Object.entries(updates).filter(([key]) =>
        paramNames.includes(key as T)
      )
      if (updateEntries.length > 0) {
        setState(
          Object.fromEntries(updateEntries) as Partial<
            Record<T, string | null | undefined>
          >,
          options
        )
      }
    },
    [paramNames, setState]
  )

  return {
    ...state,
    isPending,
    setState,
    deleteState,
    batchUpdate,
  }
}
