import * as React from "react"

export interface UseNetworkQualityOptions {
  sampleInterval?: number
  testEndpoint?: string
  enabled?: boolean
}

export type NetworkQualityCategory =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "unknown"

export interface UseNetworkQualityReturn {
  rtt: number | null
  downKbps: number | null
  upKbps: number | null
  category: NetworkQualityCategory
  isMeasuring: boolean
  error: Error | null
}

const DEFAULT_SAMPLE_INTERVAL = 5000 // 5 seconds
const DEFAULT_TEST_ENDPOINT = "https://www.google.com/favicon.ico"
const TEST_PAYLOAD_SIZE = 10 * 1024 // 10KB for throughput tests

function measureRTT(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now()
    fetch(url, {
      method: "HEAD",
      cache: "no-cache",
      mode: "no-cors",
    })
      .then(() => {
        const endTime = performance.now()
        resolve(endTime - startTime)
      })
      .catch(() => {
        const start = performance.now()
        fetch(url, {
          method: "GET",
          cache: "no-cache",
        })
          .then(() => {
            const end = performance.now()
            resolve(end - start)
          })
          .catch(reject)
      })
  })
}

function measureDownloadSpeed(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now()
    fetch(url, {
      cache: "no-cache",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const endTime = performance.now()
        const duration = (endTime - startTime) / 1000 // Convert to seconds
        const sizeBytes = blob.size
        const speedKbps = (sizeBytes * 8) / (duration * 1000) // Convert to Kbps
        resolve(speedKbps)
      })
      .catch(reject)
  })
}

function measureUploadSpeed(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const testData = new ArrayBuffer(TEST_PAYLOAD_SIZE)
    const startTime = performance.now()

    fetch(url, {
      method: "POST",
      body: testData,
      cache: "no-cache",
    })
      .then(() => {
        const endTime = performance.now()
        const duration = (endTime - startTime) / 1000
        const speedKbps = (TEST_PAYLOAD_SIZE * 8) / (duration * 1000)
        resolve(speedKbps)
      })
      .catch(() => {
        resolve(0)
      })
  })
}

function categorizeQuality(
  rtt: number | null,
  downKbps: number | null,
  upKbps: number | null
): NetworkQualityCategory {
  if (rtt === null && downKbps === null && upKbps === null) {
    return "unknown"
  }

  const hasRtt = rtt !== null
  const hasDown = downKbps !== null
  const hasUp = upKbps !== null

  let score = 0
  let maxScore = 0

  if (hasRtt) {
    maxScore += 1
    if (rtt < 50) score += 1
    else if (rtt < 100) score += 0.75
    else if (rtt < 200) score += 0.5
    else score += 0.25
  }

  if (hasDown) {
    maxScore += 1
    if (downKbps > 5000) score += 1
    else if (downKbps > 2000) score += 0.75
    else if (downKbps > 500) score += 0.5
    else score += 0.25
  }

  if (hasUp) {
    maxScore += 1
    if (upKbps > 2000) score += 1
    else if (upKbps > 1000) score += 0.75
    else if (upKbps > 200) score += 0.5
    else score += 0.25
  }

  if (maxScore === 0) return "unknown"

  const normalizedScore = score / maxScore

  if (normalizedScore >= 0.85) return "excellent"
  if (normalizedScore >= 0.65) return "good"
  if (normalizedScore >= 0.4) return "fair"
  return "poor"
}

export function useNetworkQuality(
  options: UseNetworkQualityOptions = {}
): UseNetworkQualityReturn {
  const {
    sampleInterval = DEFAULT_SAMPLE_INTERVAL,
    testEndpoint = DEFAULT_TEST_ENDPOINT,
    enabled = true,
  } = options

  const [rtt, setRtt] = React.useState<number | null>(null)
  const [downKbps, setDownKbps] = React.useState<number | null>(null)
  const [upKbps, setUpKbps] = React.useState<number | null>(null)
  const [isMeasuring, setIsMeasuring] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const measureQuality = React.useCallback(async () => {
    if (!enabled || typeof window === "undefined") return

    setIsMeasuring(true)
    setError(null)

    try {
      try {
        const rttValue = await measureRTT(testEndpoint)
        setRtt(rttValue)
      } catch (err) {
        console.warn("Failed to measure RTT:", err)
      }

      try {
        const downSpeed = await measureDownloadSpeed(testEndpoint)
        setDownKbps(downSpeed)
      } catch (err) {
        console.warn("Failed to measure download speed:", err)
      }

      try {
        const upSpeed = await measureUploadSpeed(testEndpoint)
        setUpKbps(upSpeed > 0 ? upSpeed : null)
      } catch (err) {
        setUpKbps(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsMeasuring(false)
    }
  }, [enabled, testEndpoint])

  React.useEffect(() => {
    if (enabled) {
      measureQuality()
    }
  }, [enabled, measureQuality])

  React.useEffect(() => {
    if (!enabled || sampleInterval <= 0) return

    const intervalId = setInterval(() => {
      measureQuality()
    }, sampleInterval)

    return () => clearInterval(intervalId)
  }, [enabled, sampleInterval, measureQuality])

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const handleOnline = () => {
      measureQuality()
    }

    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [enabled, measureQuality])

  const category = React.useMemo(
    () => categorizeQuality(rtt, downKbps, upKbps),
    [rtt, downKbps, upKbps]
  )

  return {
    rtt,
    downKbps,
    upKbps,
    category,
    isMeasuring,
    error,
  }
}
