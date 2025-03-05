import { useBattery } from "registry/hooks/use-battery"

import { Badge } from "@/components/ui/badge"

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
        <p className="text-red-500 text-balance text-center mx-auto text-muted-foreground">
          Battery status not supported by the browser or device. Please use a
          different browser or device.
        </p>
      )}
    </div>
  )
}
