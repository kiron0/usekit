import * as React from "react"

export interface UseTaskQueueOptions {
  concurrency: number
}

export interface EnqueueOptions {
  priority?: number
}

type Task<T> = () => Promise<T>

interface QueuedTask<T> {
  task: Task<T>
  priority: number
  resolve: (value: T) => void
  reject: (error: unknown) => void
  id: symbol
}

export function useTaskQueue(options: UseTaskQueueOptions) {
  const { concurrency } = options
  const queueRef = React.useRef<QueuedTask<unknown>[]>([])
  const runningRef = React.useRef<Set<symbol>>(new Set())
  const isProcessingRef = React.useRef(false)

  const processQueue = React.useCallback(() => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    queueRef.current.sort((a, b) => b.priority - a.priority)

    while (
      runningRef.current.size < concurrency &&
      queueRef.current.length > 0
    ) {
      const queuedTask = queueRef.current.shift()
      if (!queuedTask) break

      const { task, resolve, reject, id } = queuedTask
      runningRef.current.add(id)

      Promise.resolve()
        .then(() => task())
        .then((result) => {
          runningRef.current.delete(id)
          resolve(result)
          setTimeout(() => {
            isProcessingRef.current = false
            processQueue()
          }, 0)
        })
        .catch((error) => {
          runningRef.current.delete(id)
          reject(error)
          setTimeout(() => {
            isProcessingRef.current = false
            processQueue()
          }, 0)
        })
    }

    isProcessingRef.current = false
  }, [concurrency])

  const enqueue = React.useCallback(
    <T>(task: Task<T>, options: EnqueueOptions = {}): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        const id = Symbol()
        const priority = options.priority ?? 0

        queueRef.current.push({
          task: task as Task<unknown>,
          priority,
          resolve: resolve as (value: unknown) => void,
          reject,
          id,
        })

        processQueue()
      })
    },
    [processQueue]
  )

  const cancelAll = React.useCallback(() => {
    queueRef.current.forEach((queuedTask) => {
      queuedTask.reject(new Error("Task queue cancelled"))
    })
    queueRef.current = []
    runningRef.current.clear()
  }, [])

  return {
    enqueue,
    cancelAll,
  }
}
