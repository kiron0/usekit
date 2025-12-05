import * as React from "react"

export interface TrackedSectionConfig {
  id: string
  ref: React.RefObject<HTMLElement | null>
}

export interface UseSectionTrackerOptions {
  rootMargin?: string
  threshold?: number
}

export interface UseSectionTrackerResult {
  activeSection: string | null
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

export function useSectionTracker(
  sections: TrackedSectionConfig[],
  options: UseSectionTrackerOptions = {}
): UseSectionTrackerResult {
  const { rootMargin = "0px 0px -40% 0px", threshold = 0 } = options

  const [activeSection, setActiveSection] = React.useState<string | null>(null)
  const visibilityRef = React.useRef<
    Record<string, { ratio: number; top: number }>
  >({})

  React.useEffect(() => {
    if (!isBrowser()) return
    if (!sections.length) return

    const elementToId = new Map<Element, string>()
    const visibility = visibilityRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        let nextActive = activeSection
        let bestTop = Number.POSITIVE_INFINITY

        for (const entry of entries) {
          const id = elementToId.get(entry.target)
          if (!id) continue

          visibility[id] = {
            ratio: entry.intersectionRatio,
            top: entry.boundingClientRect.top,
          }
        }

        for (const [id, state] of Object.entries(visibility)) {
          if (state.ratio <= threshold) continue
          const top = state.top
          if (top < 0 || top > window.innerHeight) continue
          if (top < bestTop) {
            bestTop = top
            nextActive = id
          }
        }

        if (nextActive !== activeSection) {
          setActiveSection(nextActive ?? null)
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    )

    for (const section of sections) {
      const node = section.ref.current
      if (!node) continue
      elementToId.set(node, section.id)
      observer.observe(node)
    }

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, rootMargin, threshold])

  return { activeSection }
}
