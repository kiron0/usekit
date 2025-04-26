"use client"

import { useState } from "react"
import { Vibrate } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useVibration } from "registry/hooks/use-vibration"

export default function UseVibrationDemo() {
  const { vibrate, stop, isSupported, isVibrating } = useVibration(
    [1000, 500, 1000],
    { loop: true }
  )
  const [isAnimating, setIsAnimating] = useState(false)

  const handleVibrate = () => {
    vibrate([1000, 500, 1000])
    setIsAnimating(true)
  }

  const handleStop = () => {
    stop()
    setIsAnimating(false)
  }

  if (!isSupported) return <p>Vibration not supported</p>

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Vibrate size={100} className={isAnimating ? "animate-vibrate" : ""} />
      <div className="flex items-center gap-4">
        <Button onClick={handleVibrate} disabled={isVibrating}>
          Start Vibrating
        </Button>
        <Button onClick={handleStop} disabled={!isVibrating}>
          Stop Vibrating
        </Button>
      </div>
    </div>
  )
}
