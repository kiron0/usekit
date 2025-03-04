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
  const watchId = React.useRef<number>(0)
  const isMounted = React.useRef(true)

  React.useEffect(() => {
    optionsRef.current = options
  }, [options])

  React.useEffect(() => {
    isMounted.current = true

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

    const requestGeolocation = async () => {
      try {
        if (!navigator.geolocation) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: new Error("Geolocation is not supported by your browser"),
          }))
          return
        }

        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          })

          if (permissionStatus.state === "denied") {
            throw new Error("Geolocation permission denied")
          }
        }

        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          optionsRef.current
        )

        watchId.current = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          optionsRef.current
        )
      } catch (error) {
        handleError(error as GeolocationPositionError)
      }
    }

    requestGeolocation()

    return () => {
      isMounted.current = false
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current)
      }
    }
  }, [])

  return state
}
