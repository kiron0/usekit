import * as React from "react"

interface Battery {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<Battery>
  }
}

type BatteryManager = {
  supported: boolean
  loading: boolean
  level: number | null
  charging: boolean | null
  chargingTime: number | null
  dischargingTime: number | null
}

export function useBattery(): BatteryManager {
  const [state, setState] = React.useState<BatteryManager>({
    supported: true,
    loading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
  })

  React.useEffect(() => {
    if (!navigator.getBattery) {
      setState((s) => ({
        ...s,
        supported: false,
        loading: false,
      }))
      return
    }

    let battery: Battery | null = null

    const handleChange = () => {
      if (battery) {
        setState({
          supported: true,
          loading: false,
          level: battery.level * 100,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        })
      }
    }

    navigator.getBattery().then((b: Battery) => {
      battery = b
      handleChange()

      b.addEventListener("levelchange", handleChange)
      b.addEventListener("chargingchange", handleChange)
      b.addEventListener("chargingtimechange", handleChange)
      b.addEventListener("dischargingtimechange", handleChange)
    })

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", handleChange)
        battery.removeEventListener("chargingchange", handleChange)
        battery.removeEventListener("chargingtimechange", handleChange)
        battery.removeEventListener("dischargingtimechange", handleChange)
      }
    }
  }, [])

  return state
}
