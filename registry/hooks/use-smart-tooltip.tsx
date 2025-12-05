"use client"

import * as React from "react"
import { createPortal } from "react-dom"

export type TooltipSide = "top" | "bottom" | "left" | "right"

export interface UseSmartTooltipOptions {
  prefersDirection?: TooltipSide
  offset?: number
  viewportPadding?: number
  enableCollisionDetection?: boolean
  tooltipClassName?: string
  renderContent?: (position: TooltipPosition | null) => React.ReactNode
}

export interface TooltipPosition {
  side: TooltipSide
  x: number
  y: number
  flipped: boolean
}

export interface UseSmartTooltipReturn {
  triggerRef: React.RefObject<HTMLElement | null>
  tooltipRef: React.RefObject<HTMLElement | null>
  position: TooltipPosition | null
  isVisible: boolean
  show: () => void
  hide: () => void
  toggle: () => void
  Tooltip: React.FC<{ children?: React.ReactNode }>
}

function calculatePosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: TooltipSide,
  offset: number
): { x: number; y: number } {
  const triggerCenterX = triggerRect.left + triggerRect.width / 2
  const triggerCenterY = triggerRect.top + triggerRect.height / 2

  switch (side) {
    case "top":
      return {
        x: triggerCenterX - tooltipRect.width / 2,
        y: triggerRect.top - tooltipRect.height - offset,
      }
    case "bottom":
      return {
        x: triggerCenterX - tooltipRect.width / 2,
        y: triggerRect.bottom + offset,
      }
    case "left":
      return {
        x: triggerRect.left - tooltipRect.width - offset,
        y: triggerCenterY - tooltipRect.height / 2,
      }
    case "right":
      return {
        x: triggerRect.right + offset,
        y: triggerCenterY - tooltipRect.height / 2,
      }
  }
}

function checkCollision(
  position: { x: number; y: number },
  tooltipRect: DOMRect,
  viewportPadding: number
): boolean {
  return (
    position.x < viewportPadding ||
    position.y < viewportPadding ||
    position.x + tooltipRect.width > window.innerWidth - viewportPadding ||
    position.y + tooltipRect.height > window.innerHeight - viewportPadding
  )
}

function findBestPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  prefersDirection: TooltipSide,
  offset: number,
  viewportPadding: number
): TooltipPosition {
  const sides: TooltipSide[] = ["top", "bottom", "left", "right"]
  const preferredIndex = sides.indexOf(prefersDirection)
  const orderedSides = [
    ...sides.slice(preferredIndex),
    ...sides.slice(0, preferredIndex),
  ]

  for (const side of orderedSides) {
    const position = calculatePosition(triggerRect, tooltipRect, side, offset)
    const hasCollision = checkCollision(position, tooltipRect, viewportPadding)

    if (!hasCollision) {
      return {
        side,
        x: position.x,
        y: position.y,
        flipped: side !== prefersDirection,
      }
    }
  }

  const fallbackPosition = calculatePosition(
    triggerRect,
    tooltipRect,
    prefersDirection,
    offset
  )

  let adjustedX = fallbackPosition.x
  let adjustedY = fallbackPosition.y

  if (adjustedX < viewportPadding) {
    adjustedX = viewportPadding
  } else if (
    adjustedX + tooltipRect.width >
    window.innerWidth - viewportPadding
  ) {
    adjustedX = window.innerWidth - tooltipRect.width - viewportPadding
  }

  if (adjustedY < viewportPadding) {
    adjustedY = viewportPadding
  } else if (
    adjustedY + tooltipRect.height >
    window.innerHeight - viewportPadding
  ) {
    adjustedY = window.innerHeight - tooltipRect.height - viewportPadding
  }

  return {
    side: prefersDirection,
    x: adjustedX,
    y: adjustedY,
    flipped: false,
  }
}

export function useSmartTooltip(
  options: UseSmartTooltipOptions = {}
): UseSmartTooltipReturn {
  const {
    prefersDirection = "top",
    offset = 8,
    viewportPadding = 8,
    enableCollisionDetection = true,
    tooltipClassName,
    renderContent,
  } = options

  const triggerRef = React.useRef<HTMLElement | null>(null)
  const tooltipRef = React.useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState<TooltipPosition | null>(null)

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || !isVisible) {
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()

    const tooltip = tooltipRef.current
    const wasInvisible = tooltip.classList.contains("invisible")
    const originalLeft = tooltip.style.left
    const originalTop = tooltip.style.top
    const originalOpacity = tooltip.style.opacity

    tooltip.classList.remove("invisible")
    tooltip.style.position = "fixed"
    tooltip.style.left = "-9999px"
    tooltip.style.top = "-9999px"
    tooltip.style.opacity = "0"
    tooltip.style.pointerEvents = "none"

    void tooltip.offsetWidth

    const tooltipRect = tooltip.getBoundingClientRect()

    tooltip.style.left = originalLeft
    tooltip.style.top = originalTop
    tooltip.style.opacity = originalOpacity || ""
    tooltip.style.pointerEvents = ""
    if (wasInvisible) {
      tooltip.classList.add("invisible")
    }

    if (tooltipRect.width === 0 || tooltipRect.height === 0) {
      return
    }

    let newPosition: TooltipPosition

    if (enableCollisionDetection) {
      newPosition = findBestPosition(
        triggerRect,
        tooltipRect,
        prefersDirection,
        offset,
        viewportPadding
      )
    } else {
      const pos = calculatePosition(
        triggerRect,
        tooltipRect,
        prefersDirection,
        offset
      )
      newPosition = {
        side: prefersDirection,
        x: pos.x,
        y: pos.y,
        flipped: false,
      }
    }

    setPosition((prev) => {
      if (
        prev &&
        prev.side === newPosition.side &&
        Math.abs(prev.x - newPosition.x) < 1 &&
        Math.abs(prev.y - newPosition.y) < 1 &&
        prev.flipped === newPosition.flipped
      ) {
        return prev
      }
      return newPosition
    })
  }, [
    isVisible,
    prefersDirection,
    offset,
    viewportPadding,
    enableCollisionDetection,
  ])

  React.useEffect(() => {
    if (!isVisible) {
      setPosition(null)
      return
    }

    const calculatePositionAfterRender = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updatePosition()
        })
      })
    }

    calculatePositionAfterRender()

    const handleResize = () => {
      updatePosition()
    }

    const handleScroll = () => {
      updatePosition()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [isVisible, updatePosition])

  const show = React.useCallback(() => {
    setIsVisible(true)
  }, [])

  const hide = React.useCallback(() => {
    setIsVisible(false)
  }, [])

  const toggle = React.useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  const Tooltip: React.FC<{ children?: React.ReactNode }> = React.useCallback(
    function TooltipComponent({ children }) {
      if (!isVisible || typeof window === "undefined") return null

      const defaultClassName =
        "pointer-events-none fixed z-[9999] rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95"

      const content = renderContent
        ? renderContent(position)
        : children || (
            <div className="whitespace-nowrap">
              {position ? (
                <>
                  Tooltip on {position.side}
                  {position.flipped && " (flipped)"}
                </>
              ) : (
                "Calculating position..."
              )}
            </div>
          )

      return createPortal(
        <div
          ref={tooltipRef as React.RefObject<HTMLDivElement>}
          className={
            tooltipClassName
              ? `${defaultClassName} ${tooltipClassName}`
              : defaultClassName + (!position ? " invisible" : "")
          }
          style={{
            left: position ? `${position.x}px` : "0px",
            top: position ? `${position.y}px` : "0px",
          }}
        >
          {content}
        </div>,
        document.body
      )
    },
    [isVisible, position, tooltipRef, tooltipClassName, renderContent]
  )

  Tooltip.displayName = "SmartTooltip"

  return {
    triggerRef,
    tooltipRef,
    position,
    isVisible,
    show,
    hide,
    toggle,
    Tooltip,
  }
}
