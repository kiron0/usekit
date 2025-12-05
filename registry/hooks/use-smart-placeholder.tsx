import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const densityConfig = {
  compact: { lineGap: 0.2, listGap: 0.45, cardGap: 0.9 },
  comfortable: { lineGap: 0.35, listGap: 0.7, cardGap: 1.1 },
  relaxed: { lineGap: 0.5, listGap: 1, cardGap: 1.3 },
} as const

const animationDurationMap = {
  slow: "2.4s",
  normal: "1.5s",
  fast: "0.9s",
} as const

type PlaceholderDensity = keyof typeof densityConfig
type PlaceholderAnimationSpeed = keyof typeof animationDurationMap

const baseSkeleton = cva(
  "relative select-none overflow-hidden rounded-md text-transparent",
  {
    variants: {
      shape: {
        text: "h-4",
        avatar: "rounded-full",
        thumbnail: "rounded-lg",
        card: "rounded-xl",
      },
      tone: {
        default: "bg-muted",
        soft: "bg-muted/70",
        contrast: "bg-muted-foreground/40",
      },
      animation: {
        pulse: "motion-safe:animate-pulse",
        none: "animate-none",
      },
    },
    defaultVariants: {
      tone: "default",
      animation: "pulse",
    },
  }
)

function normalizeSeed(seed: number | string) {
  if (typeof seed === "number") {
    return Math.abs(seed)
  }

  return seed.split("").reduce((acc, char, index) => {
    return acc + char.charCodeAt(0) * (index + 1)
  }, 0)
}

function createRandom(seed: number | string) {
  let state = normalizeSeed(seed) % 2147483647
  if (state <= 0) {
    state += 2147483646
  }

  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function randomWidth(random: () => number, min: number, max: number): string {
  const value = random() * (max - min) + min
  return `${value.toFixed(0)}%`
}

function randomDelay(random: () => number, min = 0, max = 0.8) {
  const value = random() * (max - min) + min
  return `${value.toFixed(2)}s`
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefers(mediaQuery.matches)

    updatePreference()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference)
      return () => mediaQuery.removeEventListener("change", updatePreference)
    }

    mediaQuery.addListener?.(updatePreference)
    return () => mediaQuery.removeListener?.(updatePreference)
  }, [])

  return prefers
}

export type SmartPlaceholderType =
  | "text"
  | "avatar"
  | "thumbnail"
  | "card"
  | "list"

export interface UseSmartPlaceholderOptions extends VariantProps<
  typeof baseSkeleton
> {
  lines?: number
  width?: string
  height?: string
  seed?: number | string
  density?: PlaceholderDensity
  animationSpeed?: PlaceholderAnimationSpeed
}

export interface UseSmartPlaceholderReturn {
  render: () => React.ReactNode
}

export function useSmartPlaceholder(
  type: SmartPlaceholderType,
  options: UseSmartPlaceholderOptions = {}
): UseSmartPlaceholderReturn {
  const {
    lines = 3,
    tone,
    shape,
    width,
    height,
    seed,
    density = "comfortable",
    animationSpeed = "normal",
    animation,
  } = options

  const densityValues = densityConfig[density] ?? densityConfig.comfortable
  const prefersReducedMotion = usePrefersReducedMotion()
  const animationVariant = prefersReducedMotion ? "none" : animation
  const animationDuration = animationDurationMap[animationSpeed]

  const random = React.useMemo(() => {
    if (seed === undefined || seed === null) {
      return () => Math.random()
    }
    return createRandom(seed)
  }, [seed])

  const buildSkeletonLine = React.useCallback(
    (
      key: React.Key,
      {
        widthOverride,
        marginBottom,
      }: { widthOverride?: string; marginBottom?: string } = {}
    ) => (
      <div
        key={key}
        className={baseSkeleton({
          shape: shape ?? "text",
          tone,
          animation: animationVariant,
        })}
        style={{
          width: widthOverride ?? width ?? randomWidth(random, 55, 95),
          animationDelay: randomDelay(random),
          animationDuration,
          marginBottom: marginBottom ?? "0",
        }}
      />
    ),
    [animationDuration, animationVariant, random, shape, tone, width]
  )

  const renderText = React.useCallback(
    (lineCount = lines, gap = densityValues.lineGap) => {
      return Array.from({ length: lineCount }).map((_, index) => {
        const marginBottom =
          index === lineCount - 1 ? "0" : `${gap.toFixed(2)}rem`
        return buildSkeletonLine(index, { marginBottom })
      })
    },
    [buildSkeletonLine, densityValues.lineGap, lines]
  )

  const renderAvatar = React.useCallback(() => {
    return (
      <div
        className={baseSkeleton({
          shape: "avatar",
          tone,
          animation: animationVariant,
        })}
        style={{
          width: width ?? "3rem",
          height: height ?? "3rem",
          animationDelay: randomDelay(random),
          animationDuration,
        }}
      />
    )
  }, [animationDuration, animationVariant, height, random, tone, width])

  const renderThumbnail = React.useCallback(
    (customDimensions?: { width?: string; height?: string }) => {
      return (
        <div
          className={baseSkeleton({
            shape: "thumbnail",
            tone,
            animation: animationVariant,
          })}
          style={{
            width: customDimensions?.width ?? width ?? "100%",
            height: customDimensions?.height ?? height ?? "160px",
            animationDelay: randomDelay(random),
            animationDuration,
          }}
        />
      )
    },
    [animationDuration, animationVariant, height, random, tone, width]
  )

  const renderCard = React.useCallback(() => {
    const primaryLines = Math.max(2, Math.floor(lines * 0.6))
    const secondaryLines = Math.max(2, Math.floor(lines * 0.4))

    return (
      <div
        className="flex flex-col rounded-xl border border-dashed border-muted-foreground/20 bg-background/60 p-4"
        style={{ gap: `${densityValues.cardGap}rem` }}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="sm:w-1/3">
            <div className="rounded-lg border border-muted/40 bg-muted/30 p-2">
              {renderThumbnail({ height: height ?? "140px" })}
            </div>
          </div>
          <div className="flex-1 space-y-2">{renderText(primaryLines)}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              {renderText(secondaryLines)}
            </div>
          ))}
        </div>
      </div>
    )
  }, [densityValues.cardGap, height, lines, renderText, renderThumbnail])

  const renderList = React.useCallback(() => {
    return (
      <div
        className="flex flex-col"
        style={{ gap: `${densityValues.listGap}rem` }}
      >
        {Array.from({ length: lines }).map((_, index) => {
          const primaryWidth = width ?? randomWidth(random, 65, 95)
          const secondaryWidth = width ?? randomWidth(random, 35, 60)

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center">
                {renderAvatar()}
              </div>
              <div className="flex-1">
                {buildSkeletonLine(`list-primary-${index}`, {
                  widthOverride: primaryWidth,
                  marginBottom: `${(densityValues.lineGap * 0.8).toFixed(2)}rem`,
                })}
                {buildSkeletonLine(`list-secondary-${index}`, {
                  widthOverride: secondaryWidth,
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [
    buildSkeletonLine,
    densityValues.lineGap,
    densityValues.listGap,
    lines,
    random,
    renderAvatar,
    width,
  ])

  const render = React.useCallback(() => {
    switch (type) {
      case "avatar":
        return renderAvatar()
      case "thumbnail":
        return renderThumbnail()
      case "card":
        return renderCard()
      case "list":
        return renderList()
      case "text":
      default:
        return renderText()
    }
  }, [type, renderAvatar, renderCard, renderList, renderText, renderThumbnail])

  return { render }
}
