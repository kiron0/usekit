import * as React from "react"

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  userAgent: string
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    userAgent: "",
  })

  React.useEffect(() => {
    const ua = navigator.userAgent
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    const isTablet =
      /(ipad|tablet|(android(?!.*mobile))|kindle|playbook|silk)/i.test(ua)
    const isDesktop = !isMobile && !isTablet

    setDeviceInfo({ isMobile, isTablet, isDesktop, userAgent: ua })
  }, [])

  return deviceInfo
}
