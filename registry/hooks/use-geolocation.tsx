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
}

export function useGeolocation(options?: PositionOptions): GeolocationState {
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
  })

  const optionsRef = React.useRef(options)

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error("Geolocation is not supported by your browser"),
      }))
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { coords, timestamp } = position
      setState({
        loading: false,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
        timestamp,
        error: null,
      })
    }

    const handleError = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }))
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      optionsRef.current
    )

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      optionsRef.current
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [options])

  return state
}

export default useGeolocation
