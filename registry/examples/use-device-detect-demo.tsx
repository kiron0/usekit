"use client"

import { useDeviceDetect } from "registry/hooks/use-device-detect"

export default function UseDeviceDetectDemo() {
  const { isMobile, isTablet, isDesktop, userAgent } = useDeviceDetect()

  return (
    <div className="w-full max-w-sm rounded-md bg-secondary p-4 text-secondary-foreground">
      <h2 className="mb-2 text-center text-lg font-semibold underline underline-offset-4">
        Device Detection
      </h2>
      <p>
        <strong>Is Mobile:</strong> {isMobile ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Tablet:</strong> {isTablet ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Desktop:</strong> {isDesktop ? "Yes" : "No"}
      </p>
      <p>
        <strong>User Agent:</strong> {userAgent}
      </p>
    </div>
  )
}
