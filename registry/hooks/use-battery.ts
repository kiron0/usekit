import * as React from "react"

interface Battery extends EventTarget {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  onlevelchange: (() => void) | null
  onchargingchange: (() => void) | null
  onchargingtimechange: (() => void) | null
  ondischargingtimechange: (() => void) | null
}

export interface Navigator {
  getBattery: () => Promise<Battery>
}

declare const navigator: Navigator

interface BatteryManager {
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
        const isBatteryAbsent =
          battery.charging === true &&
          battery.level === 1.0 &&
          battery.dischargingTime === Infinity

        setState({
          supported: !isBatteryAbsent,
          loading: false,
          level: battery.level * 100 || 0,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        })
      }
    }

    navigator
      .getBattery()
      .then((b: Battery) => {
        battery = b
        handleChange()

        b.onlevelchange = handleChange
        b.onchargingchange = handleChange
        b.onchargingtimechange = handleChange
        b.ondischargingtimechange = handleChange
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          supported: false,
          loading: false,
        }))
      })

    return () => {
      if (battery) {
        battery.onlevelchange = null
        battery.onchargingchange = null
        battery.onchargingtimechange = null
        battery.ondischargingtimechange = null
      }
    }
  }, [])

  return state
}
