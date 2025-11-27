"use client"

import * as React from "react"

const DEFAULT_DEBOUNCE_MS = 1200
const DEFAULT_STORAGE_KEY = "usekit:form-autosave"

interface StoredDraft<T> {
  values: T
  savedAt: number
  sessionId: string
}

export interface UseFormAutosaveOptions {
  debounceMs?: number
  storage?: Storage
  enabled?: boolean
  flushOnUnload?: boolean
}

export interface AutosaveConflict<T> {
  values: T
  savedAt: number
  sessionId: string
}

export interface UseFormAutosaveReturn<T> {
  savedAt: number | null
  isSaving: boolean
  hasDraft: boolean
  hasConflict: boolean
  conflict?: AutosaveConflict<T> | null
  restore: () => T | null
  clear: () => void
  flush: () => void
  hydratedValues: T | null
}

function getDefaultStorage(): Storage | null {
  if (typeof window === "undefined") return null
  return window.localStorage
}

function safeParse<T>(value: string | null): StoredDraft<T> | null {
  if (!value) return null
  try {
    return JSON.parse(value) as StoredDraft<T>
  } catch {
    return null
  }
}

export function useFormAutosave<T>(
  name: string,
  values: T,
  options: UseFormAutosaveOptions = {}
): UseFormAutosaveReturn<T> {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    storage: providedStorage,
    enabled = true,
    flushOnUnload = false,
  } = options

  const storage = providedStorage ?? getDefaultStorage()
  const storageKey = React.useMemo(
    () => `${DEFAULT_STORAGE_KEY}:${name}`,
    [name]
  )
  const sessionIdRef = React.useRef<string>(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  )
  const lastSerializedRef = React.useRef<string | null>(null)
  const pendingSaveRef = React.useRef<number | null>(null)
  const [savedAt, setSavedAt] = React.useState<number | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [hasDraft, setHasDraft] = React.useState(false)
  const [conflict, setConflict] = React.useState<AutosaveConflict<T> | null>(
    null
  )
  const [hydratedValues, setHydratedValues] = React.useState<T | null>(null)
  const savedAtRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    savedAtRef.current = savedAt
  }, [savedAt])

  const readDraft = React.useCallback((): StoredDraft<T> | null => {
    if (!storage) return null
    return safeParse<T>(storage.getItem(storageKey))
  }, [storage, storageKey])

  React.useEffect(() => {
    const draft = readDraft()
    if (draft) {
      setSavedAt(draft.savedAt)
      savedAtRef.current = draft.savedAt
      setHasDraft(true)
      if (draft.sessionId !== sessionIdRef.current) {
        setConflict({
          values: draft.values,
          savedAt: draft.savedAt,
          sessionId: draft.sessionId,
        })
      }
      lastSerializedRef.current = JSON.stringify(draft.values)
    }
  }, [readDraft])

  const persistDraft = React.useCallback(
    (payloadValues: T, serialized?: string) => {
      if (!storage) {
        setIsSaving(false)
        return
      }

      const nextSerialized = serialized ?? JSON.stringify(payloadValues)
      if (nextSerialized === lastSerializedRef.current) {
        setIsSaving(false)
        return
      }

      const record: StoredDraft<T> = {
        values: payloadValues,
        savedAt: Date.now(),
        sessionId: sessionIdRef.current,
      }

      storage.setItem(storageKey, JSON.stringify(record))
      lastSerializedRef.current = nextSerialized
      setSavedAt(record.savedAt)
      savedAtRef.current = record.savedAt
      setHasDraft(true)
      setConflict(null)
      setIsSaving(false)
    },
    [storage, storageKey]
  )

  const flush = React.useCallback(() => {
    if (!enabled) return
    if (pendingSaveRef.current) {
      window.clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }
    persistDraft(values)
  }, [enabled, persistDraft, values])

  React.useEffect(() => {
    if (!enabled || !storage) return

    const serialized = JSON.stringify(values)
    if (serialized === lastSerializedRef.current) return

    setIsSaving(true)
    pendingSaveRef.current = window.setTimeout(() => {
      persistDraft(values, serialized)
      pendingSaveRef.current = null
    }, debounceMs)

    return () => {
      if (pendingSaveRef.current) {
        window.clearTimeout(pendingSaveRef.current)
        pendingSaveRef.current = null
      }
    }
  }, [values, debounceMs, storage, persistDraft, enabled])

  React.useEffect(() => {
    if (!flushOnUnload || typeof window === "undefined" || !enabled) return

    const handleBeforeUnload = () => flush()
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        flush()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [flush, enabled, flushOnUnload])

  React.useEffect(() => {
    if (typeof window === "undefined" || !storage) return

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return
      const draft = readDraft()
      if (!draft) {
        setHasDraft(false)
        setConflict(null)
        return
      }

      setHasDraft(true)
      if (
        draft.sessionId !== sessionIdRef.current &&
        (!savedAtRef.current || draft.savedAt > savedAtRef.current)
      ) {
        setConflict({
          values: draft.values,
          savedAt: draft.savedAt,
          sessionId: draft.sessionId,
        })
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [storageKey, storage, readDraft])

  const restore = React.useCallback((): T | null => {
    const draft = readDraft()
    if (!draft) return null
    setConflict(null)
    setSavedAt(draft.savedAt)
    savedAtRef.current = draft.savedAt
    lastSerializedRef.current = JSON.stringify(draft.values)
    setHydratedValues(draft.values)
    return draft.values
  }, [readDraft])

  const clear = React.useCallback(() => {
    if (!storage) return
    storage.removeItem(storageKey)
    if (pendingSaveRef.current) {
      window.clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }
    setSavedAt(null)
    savedAtRef.current = null
    setHasDraft(false)
    setConflict(null)
    lastSerializedRef.current = null
    setHydratedValues(null)
  }, [storage, storageKey])

  React.useEffect(() => {
    if (hydratedValues === null && hasDraft) {
      const draft = readDraft()
      if (draft) {
        setHydratedValues(draft.values)
      }
    }
  }, [hasDraft, hydratedValues, readDraft])

  return {
    savedAt,
    isSaving,
    hasDraft,
    hasConflict: Boolean(conflict),
    conflict,
    restore,
    clear,
    flush,
    hydratedValues,
  }
}
