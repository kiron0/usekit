import { Loader2 } from "lucide-react"
import useGeolocation from "registry/hooks/use-geolocation"

export default function UseGeolocationDemo() {
  const {
    loading,
    error,
    latitude,
    longitude,
    altitude,
    accuracy,
    altitudeAccuracy,
    heading,
    speed,
    timestamp,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  })

  if (loading) {
    return <Loader2 className="animate-spin" />
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Geolocation Data</h2>
      <div>
        <p>Latitude: {latitude!.toFixed(6)}</p>
        <p>Longitude: {longitude!.toFixed(6)}</p>
        <p>Accuracy: {accuracy} meters</p>
      </div>

      <div>
        {altitude && <p>Altitude: {altitude} meters</p>}
        {altitudeAccuracy && (
          <p>Altitude Accuracy: {altitudeAccuracy} meters</p>
        )}
        {heading && <p>Heading: {heading}° from true north</p>}
        {speed && <p>Speed: {speed} m/s</p>}
      </div>

      <p>Last updated: {new Date(timestamp!).toLocaleTimeString()}</p>
    </div>
  )
}
