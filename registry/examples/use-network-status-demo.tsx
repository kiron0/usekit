"use client"

import { useNetworkStatus } from "registry/hooks/use-network-status"

export default function UseNetworkStatusDemo() {
  const { online, effectiveType, downlink } = useNetworkStatus()

  return (
    <div className="w-full max-w-sm rounded-md bg-secondary p-4 text-secondary-foreground">
      <h2 className="mb-2 text-center text-lg font-semibold underline underline-offset-4">
        Network Status
      </h2>
      <p>
        <strong>Status:</strong>{" "}
        <span className={online ? "text-green-600" : "text-red-600"}>
          {online ? "Online" : "Offline"}
        </span>
      </p>
      {effectiveType && (
        <p>
          <strong>Connection Type:</strong> {effectiveType}
        </p>
      )}
      {downlink && (
        <p>
          <strong>Downlink Speed:</strong> {downlink} Mbps
        </p>
      )}
    </div>
  )
}
