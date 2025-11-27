"use client"

import * as React from "react"

export interface UseProgressiveUploadOptions {
  endpoint: string
  onProgress?: (progress: number) => void
  chunkSize?: number
  minChunkSize?: number
  maxChunkSize?: number
  maxRetries?: number
  retryDelay?: number
  storageKey?: string
  persistState?: boolean
}

export interface UseProgressiveUploadReturn {
  start: () => Promise<void>
  pause: () => void
  resume: () => void
  progress: number
  isUploading: boolean
  isPaused: boolean
  error: Error | null
}

interface UploadState {
  fileId: string
  totalChunks: number
  uploadedChunks: number[]
  chunkSize: number
  lastChunkIndex: number
}

const DEFAULT_CHUNK_SIZE = 256 * 1024 // 256KB
const MIN_CHUNK_SIZE = 64 * 1024 // 64KB
const MAX_CHUNK_SIZE = 2 * 1024 * 1024 // 2MB
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000
const DEFAULT_STORAGE_KEY = "usekit:upload-state"

function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function getStoredState(
  fileId: string,
  storageKey: string
): UploadState | null {
  if (typeof window === "undefined") return null

  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return null

    const state = JSON.parse(stored) as UploadState
    if (state.fileId === fileId) {
      return state
    }
  } catch {}

  return null
}

function saveState(
  state: UploadState,
  storageKey: string,
  persist: boolean
): void {
  if (!persist || typeof window === "undefined") return

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {}
}

function clearState(storageKey: string): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(storageKey)
  } catch {}
}

export function useProgressiveUpload(
  file: File | null,
  options: UseProgressiveUploadOptions
): UseProgressiveUploadReturn {
  const {
    endpoint,
    onProgress,
    chunkSize: initialChunkSize = DEFAULT_CHUNK_SIZE,
    minChunkSize = MIN_CHUNK_SIZE,
    maxChunkSize = MAX_CHUNK_SIZE,
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    storageKey = DEFAULT_STORAGE_KEY,
    persistState = true,
  } = options

  const [progress, setProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const abortControllerRef = React.useRef<AbortController | null>(null)
  const currentChunkSizeRef = React.useRef(initialChunkSize)
  const uploadStateRef = React.useRef<UploadState | null>(null)
  const isPausedRef = React.useRef(false)
  const performanceMetricsRef = React.useRef<{
    successful: number
    failed: number
    totalTime: number
    totalBytes: number
  }>({
    successful: 0,
    failed: 0,
    totalTime: 0,
    totalBytes: 0,
  })

  const adaptChunkSize = React.useCallback(
    (metrics: typeof performanceMetricsRef.current) => {
      const { successful, failed, totalTime, totalBytes } = metrics

      if (successful === 0) return

      const failureRate = failed / (successful + failed)
      const avgSpeed = totalBytes / Math.max(totalTime, 1)

      // Decrease chunk size on high failure rate or slow speed
      if (failureRate > 0.3 || avgSpeed < 50 * 1024) {
        currentChunkSizeRef.current = Math.max(
          minChunkSize,
          Math.floor(currentChunkSizeRef.current * 0.75)
        )
      }
      // Increase chunk size on good performance
      else if (failureRate < 0.1 && avgSpeed > 200 * 1024) {
        currentChunkSizeRef.current = Math.min(
          maxChunkSize,
          Math.floor(currentChunkSizeRef.current * 1.25)
        )
      }
    },
    [minChunkSize, maxChunkSize]
  )

  const uploadChunk = React.useCallback(
    async (
      chunk: Blob,
      chunkIndex: number,
      totalChunks: number,
      fileId: string
    ): Promise<void> => {
      const startTime = performance.now()
      const formData = new FormData()
      formData.append("chunk", chunk)
      formData.append("chunkIndex", chunkIndex.toString())
      formData.append("totalChunks", totalChunks.toString())
      formData.append("fileId", fileId)
      formData.append("fileName", file?.name || "")
      formData.append("fileSize", file?.size.toString() || "0")

      let lastError: Error | null = null

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Upload aborted")
        }

        if (isPausedRef.current) {
          throw new Error("Upload paused")
        }

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            signal: abortControllerRef.current?.signal,
          })

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const elapsed = performance.now() - startTime
          performanceMetricsRef.current.successful++
          performanceMetricsRef.current.totalTime += elapsed
          performanceMetricsRef.current.totalBytes += chunk.size

          adaptChunkSize(performanceMetricsRef.current)

          return
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err))

          if (
            attempt < maxRetries &&
            !abortControllerRef.current?.signal.aborted
          ) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * (attempt + 1))
            )
          }
        }
      }

      performanceMetricsRef.current.failed++
      throw lastError || new Error("Upload failed after retries")
    },
    [endpoint, file, maxRetries, retryDelay, adaptChunkSize]
  )

  const start = React.useCallback(async () => {
    if (!file) {
      setError(new Error("No file provided"))
      return
    }

    setError(null)
    setIsUploading(true)
    setIsPaused(false)
    isPausedRef.current = false

    abortControllerRef.current = new AbortController()
    const fileId = generateFileId(file)

    let state = getStoredState(fileId, storageKey)
    if (!state) {
      const totalChunks = Math.ceil(file.size / currentChunkSizeRef.current)
      state = {
        fileId,
        totalChunks,
        uploadedChunks: [],
        chunkSize: currentChunkSizeRef.current,
        lastChunkIndex: 0,
      }
    } else {
      currentChunkSizeRef.current = state.chunkSize
    }

    uploadStateRef.current = state

    try {
      const uploadedSet = new Set(state.uploadedChunks)
      let uploadedBytes = 0

      for (const chunkIndex of state.uploadedChunks) {
        const chunkStart = chunkIndex * state.chunkSize
        const chunkEnd = Math.min(chunkStart + state.chunkSize, file.size)
        uploadedBytes += chunkEnd - chunkStart
      }

      for (
        let chunkIndex = state.lastChunkIndex;
        chunkIndex < state.totalChunks;
        chunkIndex++
      ) {
        if (abortControllerRef.current?.signal.aborted || isPausedRef.current) {
          break
        }

        if (uploadedSet.has(chunkIndex)) {
          continue
        }

        const chunkStart = chunkIndex * currentChunkSizeRef.current
        const chunkEnd = Math.min(
          chunkStart + currentChunkSizeRef.current,
          file.size
        )
        const chunk = file.slice(chunkStart, chunkEnd)

        await uploadChunk(chunk, chunkIndex, state.totalChunks, fileId)

        uploadedBytes += chunkEnd - chunkStart
        uploadedSet.add(chunkIndex)

        state.uploadedChunks = Array.from(uploadedSet)
        state.lastChunkIndex = chunkIndex + 1
        state.chunkSize = currentChunkSizeRef.current

        saveState(state, storageKey, persistState)

        const newProgress = Math.min(100, (uploadedBytes / file.size) * 100)
        setProgress(newProgress)
        onProgress?.(newProgress)

        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      if (uploadedSet.size === state.totalChunks) {
        clearState(storageKey)
        setProgress(100)
        onProgress?.(100)
      }
    } catch (err) {
      const uploadError = err instanceof Error ? err : new Error(String(err))

      if (uploadError.message !== "Upload paused") {
        setError(uploadError)
      }
    } finally {
      setIsUploading(false)
    }
  }, [file, onProgress, storageKey, persistState, uploadChunk])

  const pause = React.useCallback(() => {
    isPausedRef.current = true
    setIsPaused(true)
    abortControllerRef.current?.abort()
  }, [])

  const resume = React.useCallback(() => {
    isPausedRef.current = false
    setIsPaused(false)
    if (file) {
      start()
    }
  }, [file, start])

  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return {
    start,
    pause,
    resume,
    progress,
    isUploading,
    isPaused,
    error,
  }
}
