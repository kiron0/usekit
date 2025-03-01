import { useEffect, useState } from "react"

type OrientationType =
  | "portrait-primary"
  | "landscape-primary"
  | "portrait-secondary"
  | "landscape-secondary"
  | "UNKNOWN"

interface OrientationState {
  angle: number
  type: OrientationType
}

const getLegacyOrientation = (): OrientationState => {
  const angle = window.orientation ?? 0
  let type: OrientationType = "UNKNOWN"

  switch (Math.abs(angle)) {
    case 0:
      type = "portrait-primary"
      break
    case 90:
      type = "landscape-primary"
      break
    case 180:
      type = "portrait-secondary"
      break
    case 270:
      type = "landscape-secondary"
      break
  }
  return { angle, type }
}

export function useOrientation(): OrientationState {
  const [orientation, setOrientation] = useState<OrientationState>(
    getLegacyOrientation()
  )

  const handleOrientationChange = () => {
    if (screen.orientation && typeof screen.orientation.angle === "number") {
      const { angle, type } = screen.orientation
      if (
        window.orientation !== undefined &&
        Math.abs(window.orientation) !== Math.abs(angle)
      ) {
        setOrientation(getLegacyOrientation())
      } else {
        setOrientation({ angle, type: type as OrientationType })
      }
    } else {
      setOrientation(getLegacyOrientation())
    }
  }

  useEffect(() => {
    handleOrientationChange()

    if (screen.orientation && screen.orientation.addEventListener) {
      screen.orientation.addEventListener("change", handleOrientationChange)
    }
    window.addEventListener("orientationchange", handleOrientationChange)

    return () => {
      if (screen.orientation && screen.orientation.removeEventListener) {
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        )
      }
      window.removeEventListener("orientationchange", handleOrientationChange)
    }
  }, [])

  return orientation
}
