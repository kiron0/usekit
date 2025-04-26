import * as React from "react"

type AsyncFunction<TArgs extends unknown[], TData, TError> = (
  ...args: TArgs
) => Promise<{ data: TData } | { error: TError }>

type AsyncStatus<TData, TError> =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; data: TData }
  | { state: "error"; error: TError }

interface Options<TData, TError> {
  loading?: React.ReactNode
  success?: (data: TData) => React.ReactNode
  error?: (error: TError) => React.ReactNode
}

export function useAsyncStatus<TArgs extends unknown[], TData, TError>(
  asyncFn: AsyncFunction<TArgs, TData, TError> | undefined,
  options?: Options<TData, TError>
): [
  trigger: (...args: TArgs) => Promise<void>,
  status: AsyncStatus<TData, TError>,
  data: React.ReactNode | null,
] {
  const [status, setStatus] = React.useState<AsyncStatus<TData, TError>>({
    state: "idle",
  })

  const trigger = React.useCallback(
    async (...args: TArgs) => {
      if (typeof asyncFn !== "function") {
        console.error("useAsyncStatus: asyncFn is not a function")
        setStatus({
          state: "error",
          error: "Invalid async function" as TError,
        })
        return
      }

      try {
        setStatus({ state: "loading" })
        const result = await asyncFn(...args)

        if ("error" in result) {
          setStatus({ state: "error", error: result.error })
        } else {
          setStatus({ state: "success", data: result.data })
        }
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error.message : String(error)
        setStatus({ state: "error", error: normalizedError as TError })
      }
    },
    [asyncFn]
  )

  const data = React.useMemo(() => {
    switch (status.state) {
      case "loading":
        return options?.loading || null
      case "success":
        return options?.success?.(status.data) || null
      case "error":
        const errorContent =
          typeof status.error === "string" ? status.error : String(status.error)
        return options?.error?.(errorContent as TError) || null
      default:
        return null
    }
  }, [status, options])

  return [trigger, status, data]
}
