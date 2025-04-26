import * as React from "react"

interface GeolocationState {
  loading: boolean
  accuracy: number | null
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  latitude: number | null
  longitude: number | null
  speed: number | null
  timestamp: number | null
  error: GeolocationPositionError | Error | null
  permissionDenied: boolean
}

function requestUserLocation(
  options?: PositionOptions
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export function useGeolocation(options?: PositionOptions): GeolocationState & {
  requestGeolocation: () => void
  retry: () => void
} {
  const [state, setState] = React.useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
    permissionDenied: false,
  })

  const optionsRef = React.useRef(options)
  const isMounted = React.useRef(true)

  const requestGeolocation = React.useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      permissionDenied: false,
    }))

    try {
      const position = await requestUserLocation(optionsRef.current)
      if (isMounted.current) {
        setState({
          loading: false,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          timestamp: position.timestamp,
          error: null,
          permissionDenied: false,
        })
      }
    } catch (error) {
      if (isMounted.current) {
        const isPermissionDenied =
          (error as GeolocationPositionError).code ===
          (error as GeolocationPositionError).PERMISSION_DENIED

        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as GeolocationPositionError | Error,
          permissionDenied: isPermissionDenied,
        }))
      }
    }
  }, [])

  const retry = React.useCallback(() => {
    if (state.permissionDenied) {
      alert(
        "Location access is blocked. Please enable it in your browser settings and refresh the page."
      )
    } else {
      requestGeolocation()
    }
  }, [state.permissionDenied, requestGeolocation])

  React.useEffect(() => {
    optionsRef.current = options
  }, [options])

  React.useEffect(() => {
    isMounted.current = true
    requestGeolocation()

    return () => {
      isMounted.current = false
    }
  }, [requestGeolocation])

  return { ...state, requestGeolocation, retry }
}
