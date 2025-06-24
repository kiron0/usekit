import * as React from "react"

interface Breakpoints {
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
}

const defaultBreakpoints: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

type BreakpointKey = keyof Breakpoints

interface Return {
  currentBreakpoint: BreakpointKey | null
  isAbove: (breakpoint: BreakpointKey) => boolean
  isBelow: (breakpoint: BreakpointKey) => boolean
}

export function useBreakpoint(
  breakpoints: Partial<Breakpoints> = defaultBreakpoints
): Return {
  const [currentBreakpoint, setCurrentBreakpoint] =
    React.useState<BreakpointKey | null>(null)

  React.useEffect(() => {
    const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints }

    const updateBreakpoint = () => {
      const width = window.innerWidth
      let bp: BreakpointKey | null = null

      if (width >= mergedBreakpoints["2xl"]) bp = "2xl"
      else if (width >= mergedBreakpoints.xl) bp = "xl"
      else if (width >= mergedBreakpoints.lg) bp = "lg"
      else if (width >= mergedBreakpoints.md) bp = "md"
      else if (width >= mergedBreakpoints.sm) bp = "sm"

      setCurrentBreakpoint(bp)
    }

    // Initialize and set up event listener
    updateBreakpoint()
    window.addEventListener("resize", updateBreakpoint)

    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [breakpoints])

  const isAbove = (breakpoint: BreakpointKey): boolean => {
    if (!currentBreakpoint) return false
    const bpOrder: BreakpointKey[] = ["sm", "md", "lg", "xl", "2xl"]
    return bpOrder.indexOf(currentBreakpoint) >= bpOrder.indexOf(breakpoint)
  }

  const isBelow = (breakpoint: BreakpointKey): boolean => {
    if (!currentBreakpoint) return true
    const bpOrder: BreakpointKey[] = ["sm", "md", "lg", "xl", "2xl"]
    return bpOrder.indexOf(currentBreakpoint) < bpOrder.indexOf(breakpoint)
  }

  return { currentBreakpoint, isAbove, isBelow }
}
