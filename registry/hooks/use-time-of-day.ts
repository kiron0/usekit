import * as React from "react"

type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

export function useTimeOfDay(): TimeOfDay {
  const getTimeOfDay = React.useCallback((): TimeOfDay => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 17) return "afternoon"
    if (hour < 20) return "evening"
    return "night"
  }, [])

  const [timeOfDay, setTimeOfDay] = React.useState<TimeOfDay>(getTimeOfDay())

  React.useEffect(() => {
    const updateTimeOfDay = () => setTimeOfDay(getTimeOfDay())
    const interval = setInterval(updateTimeOfDay, 60000)
    return () => clearInterval(interval)
  }, [getTimeOfDay])

  return timeOfDay
}
