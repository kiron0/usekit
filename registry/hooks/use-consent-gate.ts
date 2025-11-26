"use client"

import * as React from "react"

type Feature = string
type ConsentState = Record<Feature, boolean>

export interface UseConsentGateOptions {
  storageKey?: string
  initialState?: Partial<ConsentState>
  persist?: boolean
  serialize?: (state: ConsentState) => string
  deserialize?: (value: string) => ConsentState
}

interface UseConsentGateReturn {
  allowed: (feature: Feature) => boolean
  request: (feature: Feature, granted?: boolean) => void
  revoke: (feature: Feature) => void
  consents: ConsentState
  allGranted: boolean
  allowedFeatures: Feature[]
}

const DEFAULT_STORAGE_KEY = "usekit:consent"

export function useConsentGate(
  features: Feature[],
  {
    storageKey = DEFAULT_STORAGE_KEY,
    initialState = {},
    persist = true,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseConsentGateOptions = {}
): UseConsentGateReturn {
  const featureList = React.useMemo(
    () => Array.from(new Set(features)).filter(Boolean),
    [features]
  )

  const getBaselineState = React.useCallback(() => {
    const baseline: ConsentState = {}
    featureList.forEach((feature) => {
      baseline[feature] = initialState[feature] ?? false
    })
    return baseline
  }, [featureList, initialState])

  const [consents, setConsents] = React.useState<ConsentState>(() => {
    if (typeof window === "undefined") {
      return getBaselineState()
    }

    if (!persist) {
      return getBaselineState()
    }

    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        const parsed = deserialize(stored) as ConsentState
        return {
          ...getBaselineState(),
          ...parsed,
        }
      }
    } catch {
      // ignore malformed storage values
    }

    return getBaselineState()
  })

  React.useEffect(() => {
    setConsents((prev) => {
      const next = {
        ...getBaselineState(),
        ...prev,
      }
      const hasDiff = featureList.some(
        (feature) => next[feature] !== prev[feature]
      )
      return hasDiff ? next : prev
    })
  }, [featureList, getBaselineState])

  React.useEffect(() => {
    if (!persist || typeof window === "undefined") return
    try {
      const payload = serialize(consents)
      window.localStorage.setItem(storageKey, payload)
    } catch {
      // ignore storage failures (e.g., private mode)
    }
  }, [consents, storageKey, persist, serialize])

  const allowed = React.useCallback(
    (feature: Feature) => !!consents[feature],
    [consents]
  )

  const request = React.useCallback((feature: Feature, granted = true) => {
    setConsents((prev) => {
      if (prev[feature] === granted) return prev
      return {
        ...prev,
        [feature]: granted,
      }
    })
  }, [])

  const revoke = React.useCallback(
    (feature: Feature) => request(feature, false),
    [request]
  )

  const allowedFeatures = React.useMemo(
    () => featureList.filter((feature) => !!consents[feature]),
    [featureList, consents]
  )

  const allGranted = featureList.every((feature) => consents[feature])

  return {
    allowed,
    request,
    revoke,
    consents,
    allGranted,
    allowedFeatures,
  }
}
