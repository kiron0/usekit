import * as React from "react"
import { Copy, RefreshCw } from "lucide-react"
import * as ReactDOM from "react-dom"

type Point = { x: number; y: number } | null

const convertPxTo = (px: number, unit: "cm" | "rem" | "inches") => {
  const rem = px / 16
  const inches = px / 96
  const cm = inches * 2.54

  return { cm, rem, inches }[unit]
}

const MOBILE_BREAKPOINT = 768

interface MeasureOptions {
  borderRadius?: number
  borderWidth?: number
  actionPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  measurementPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
  startMeasure?: boolean
  ref?: React.RefObject<HTMLDivElement | null>
}

const actionPositions = [
  { name: "top-right", top: 100, right: 16 },
  { name: "top-left", top: 100, left: 16 },
  { name: "bottom-right", bottom: 100, right: 16 },
  { name: "bottom-left", bottom: 100, left: 16 },
]

const measurementPositions = [
  { name: "top-right", top: 16, right: 16 },
  { name: "top-left", top: 16, left: 16 },
  { name: "bottom-right", bottom: 16, right: 16 },
  { name: "bottom-left", bottom: 16, left: 16 },
]

export function useMeasure({
  borderRadius = 0.5,
  borderWidth = 1,
  actionPosition = "top-right",
  measurementPosition = "bottom-left",
  startMeasure = false,
  ref,
}: MeasureOptions) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  const [startPoint, setStartPoint] = React.useState<Point>(null)
  const [endPoint, setEndPoint] = React.useState<Point>(null)
  const [isMeasuring, setMeasuring] = React.useState(false)
  const [isDragging, setDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState<{
    x: number
    y: number
  } | null>(null)
  const [resizeCorner, setResizeCorner] = React.useState<string | null>(null)
  const borderBoxRef = React.useRef<HTMLDivElement>(null)

  const originalStartRef = React.useRef<Point>(null)
  const originalEndRef = React.useRef<Point>(null)
  const initialMouseRef = React.useRef<{ x: number; y: number } | null>(null)

  const getBoundingRect = React.useCallback(() => {
    if (ref?.current) {
      return ref.current.getBoundingClientRect()
    }
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }, [ref])

  const isMouseOverCorner = (
    mouseX: number,
    mouseY: number,
    left: number,
    top: number,
    width: number,
    height: number,
    threshold = 8
  ) => {
    const corners = [
      { name: "top-left", x: left, y: top },
      { name: "top-right", x: left + width, y: top },
      { name: "bottom-left", x: left, y: top + height },
      { name: "bottom-right", x: left + width, y: top + height },
    ]

    for (const corner of corners) {
      const dx = Math.abs(mouseX - corner.x)
      const dy = Math.abs(mouseY - corner.y)
      if (dx < threshold && dy < threshold) return corner.name
    }
    return null
  }

  const handleMouseDown = React.useCallback(
    (e: MouseEvent) => {
      e.preventDefault()

      if (ref?.current && !startMeasure) return

      const rect = getBoundingRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (ref?.current && !ref.current.contains(e.target as Node)) {
        return
      }

      if (!startPoint || !endPoint) {
        setStartPoint({ x, y })
        setEndPoint({ x, y })
        setMeasuring(true)
        return
      }

      const left = Math.min(startPoint.x, endPoint.x)
      const top = Math.min(startPoint.y, endPoint.y)
      const width = Math.abs(endPoint.x - startPoint.x)
      const height = Math.abs(endPoint.y - startPoint.y)

      const corner = isMouseOverCorner(x, y, left, top, width, height)
      if (corner) {
        originalStartRef.current = startPoint
        originalEndRef.current = endPoint
        initialMouseRef.current = { x, y }
        setResizeCorner(corner)
      } else if (
        x >= left &&
        x <= left + width &&
        y >= top &&
        y <= top + height
      ) {
        setDragging(true)
        setDragOffset({ x: x - left, y: y - top })
      }
    },
    [startPoint, endPoint, getBoundingRect, ref, startMeasure]
  )

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (ref?.current && !startMeasure) return

      const rect = getBoundingRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isMeasuring) {
        const constrainedX = Math.max(0, Math.min(x, rect.width))
        const constrainedY = Math.max(0, Math.min(y, rect.height))
        setEndPoint({ x: constrainedX, y: constrainedY })
        return
      }

      if (
        resizeCorner &&
        originalStartRef.current &&
        originalEndRef.current &&
        initialMouseRef.current
      ) {
        const deltaX = x - initialMouseRef.current.x
        const deltaY = y - initialMouseRef.current.y

        const newStart = { ...originalStartRef.current }
        const newEnd = { ...originalEndRef.current }

        switch (resizeCorner) {
          case "top-left":
            newStart.x = Math.max(
              0,
              Math.min(newStart.x + deltaX, newEnd.x - 10)
            )
            newStart.y = Math.max(
              0,
              Math.min(newStart.y + deltaY, newEnd.y - 10)
            )
            break
          case "top-right":
            newEnd.x = Math.min(
              getBoundingRect().width,
              Math.max(newEnd.x + deltaX, newStart.x + 10)
            )
            newStart.y = Math.max(
              0,
              Math.min(newStart.y + deltaY, newEnd.y - 10)
            )
            break
          case "bottom-right":
            newEnd.x = Math.min(
              getBoundingRect().width,
              Math.max(newEnd.x + deltaX, newStart.x + 10)
            )
            newEnd.y = Math.min(
              getBoundingRect().height,
              Math.max(newEnd.y + deltaY, newStart.y + 10)
            )
            break
          case "bottom-left":
            newStart.x = Math.max(
              0,
              Math.min(newStart.x + deltaX, newEnd.x - 10)
            )
            newEnd.y = Math.min(
              getBoundingRect().height,
              Math.max(newEnd.y + deltaY, newStart.y + 10)
            )
            break
          default:
            break
        }

        if (newStart.x < newEnd.x && newStart.y < newEnd.y) {
          setStartPoint(newStart)
          setEndPoint(newEnd)
        }
      } else if (isDragging && dragOffset && startPoint && endPoint) {
        const width = Math.abs(endPoint.x - startPoint.x)
        const height = Math.abs(endPoint.y - startPoint.y)

        const newLeft = Math.max(
          0,
          Math.min(x - dragOffset.x, getBoundingRect().width - width)
        )
        const newTop = Math.max(
          0,
          Math.min(y - dragOffset.y, getBoundingRect().height - height)
        )

        setStartPoint({ x: newLeft, y: newTop })
        setEndPoint({ x: newLeft + width, y: newTop + height })
      }
    },
    [
      isMeasuring,
      resizeCorner,
      initialMouseRef,
      startPoint,
      endPoint,
      dragOffset,
      isDragging,
      getBoundingRect,
      ref,
      startMeasure,
    ]
  )

  const handleMouseUp = React.useCallback(() => {
    setMeasuring(false)
    setDragging(false)
    setResizeCorner(null)
    initialMouseRef.current = null
    originalStartRef.current = null
    originalEndRef.current = null
  }, [])

  React.useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return () => mql.removeEventListener("change", onChange)
    }
  }, [])

  const measurements = React.useMemo(() => {
    if (!startPoint || !endPoint) return null

    const widthPx = Math.abs(endPoint.x - startPoint.x)
    const heightPx = Math.abs(endPoint.y - startPoint.y)

    return {
      width: {
        px: widthPx,
        cm: convertPxTo(widthPx, "cm"),
        rem: convertPxTo(widthPx, "rem"),
        inches: convertPxTo(widthPx, "inches"),
      },
      height: {
        px: heightPx,
        cm: convertPxTo(heightPx, "cm"),
        rem: convertPxTo(heightPx, "rem"),
        inches: convertPxTo(heightPx, "inches"),
      },
    }
  }, [startPoint, endPoint])

  const MeasureComponent = () => {
    React.useEffect(() => {
      const borderBox = borderBoxRef.current
      if (!borderBox || !startPoint || !endPoint) return

      const handleMouseMove = (e: MouseEvent) => {
        const rect = borderBox.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const threshold = 8

        const corners = [
          { name: "top-left", x: 0, y: 0 },
          { name: "top-right", x: rect.width, y: 0 },
          { name: "bottom-left", x: 0, y: rect.height },
          { name: "bottom-right", x: rect.width, y: rect.height },
        ]

        let cursor = "move"
        for (const corner of corners) {
          const dx = Math.abs(mouseX - corner.x)
          const dy = Math.abs(mouseY - corner.y)
          if (dx < threshold && dy < threshold) {
            if (corner.name === "top-left" || corner.name === "bottom-right") {
              cursor = "nwse-resize"
            } else if (
              corner.name === "top-right" ||
              corner.name === "bottom-left"
            ) {
              cursor = "nesw-resize"
            }
            break
          }
        }

        borderBox.style.cursor = cursor
      }

      borderBox.addEventListener("mousemove", handleMouseMove)
      return () => borderBox.removeEventListener("mousemove", handleMouseMove)
    }, [])

    if (!startPoint || !endPoint || (ref?.current && !startMeasure) || isMobile)
      return null

    const rect = getBoundingRect()
    const left = Math.min(startPoint.x, endPoint.x) + rect.left
    const top = Math.min(startPoint.y, endPoint.y) + rect.top
    const width = Math.abs(endPoint.x - startPoint.x)
    const height = Math.abs(endPoint.y - startPoint.y)

    const handleReset = () => {
      setStartPoint(null)
      setEndPoint(null)
    }

    const handleCopy = async () => {
      if (measurements) {
        const text = `Width: ${measurements.width.px.toFixed(1)}px, Height: ${measurements.height.px.toFixed(1)}px`
        await navigator.clipboard.writeText(text)
      }
    }

    return ReactDOM.createPortal(
      <>
        <div
          ref={borderBoxRef}
          style={{
            position: "fixed",
            left,
            top,
            width,
            height,
            borderRadius: `${borderRadius}px`,
            borderWidth: `${borderWidth}px`,
          }}
          className="fixed z-[998] border border-dashed border-primary bg-transparent"
        />
        <div
          style={{
            ...measurementPositions.find(
              (pos) => pos.name === measurementPosition
            ),
          }}
          className="pointer-events-none fixed z-[999] rounded-md border bg-background/50 p-4 text-sm backdrop-blur"
        >
          <div className="flex flex-col gap-1">
            <span>
              Width: {measurements?.width.px?.toFixed(0)} px (
              {measurements?.width.cm?.toFixed(1)} cm,{" "}
              {measurements?.width.rem?.toFixed(1)} rem,{" "}
              {measurements?.width.inches?.toFixed(1)} inches)
            </span>
            <span>
              Height: {measurements?.height.px?.toFixed(0)} px (
              {measurements?.height.cm?.toFixed(1)} cm,{" "}
              {measurements?.height.rem?.toFixed(1)} rem,{" "}
              {measurements?.height.inches?.toFixed(1)} inches)
            </span>
          </div>
        </div>

        <div
          style={{
            ...actionPositions.find((pos) => pos.name === actionPosition),
          }}
          className="fixed z-[999] flex gap-2"
        >
          <button
            className="h-8 rounded-md bg-primary px-3 text-xs text-primary-foreground"
            onClick={handleReset}
          >
            <RefreshCw size={16} />
          </button>
          <button
            className="h-8 rounded-md bg-primary px-3 text-xs text-primary-foreground"
            onClick={handleCopy}
          >
            <Copy size={16} />
          </button>
        </div>
      </>,
      ref?.current || document.body
    )
  }

  if (isMobile || (ref?.current && !startMeasure)) {
    return {
      isMobile,
      measurements: {},
      MeasureComponent: () => null,
      reset: () => {},
    }
  } else {
    return {
      isMobile,
      measurements,
      MeasureComponent,
      reset: () => {
        setStartPoint(null)
        setEndPoint(null)
      },
    }
  }
}
