import { Badge } from "@/components/ui/badge"
import { useBattery } from "registry/hooks/use-battery"

export default function UseBatteryDemo() {
  const { loading, supported, level, charging, chargingTime, dischargingTime } =
    useBattery()

  return (
    <div className="space-y-4 text-center">
      {loading ? (
        <p>Loading...</p>
      ) : supported ? (
        <div className="space-y-2">
          <div>
            Level: <Badge>{level}%</Badge>
          </div>
          <div>
            Charging:{" "}
            <Badge variant={charging ? "default" : "destructive"}>
              {charging ? "Yes" : "No"}
            </Badge>
          </div>
          <p>Charging time: {chargingTime}</p>
          <p>Discharging time: {dischargingTime}</p>
        </div>
      ) : (
        <p className="mx-auto text-balance text-center text-muted-foreground text-red-500">
          Battery status not supported by the browser or device. Please use a
          different browser or device.
        </p>
      )}
    </div>
  )
}
