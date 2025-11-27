"use client"

import * as React from "react"

export interface ResponsiveBreakpoint {
  minWidth: number
  columns: number
}

export type ResponsiveGridLayout = "flex" | "masonry"

export interface UseResponsiveGridOptions {
  breakpoints: ResponsiveBreakpoint[]
  gap?: number
  defaultColumns?: number
  layout?: ResponsiveGridLayout
}

export interface UseResponsiveGridReturn {
  columns: number
  gap: number
  itemStyle: React.CSSProperties
  containerStyle: React.CSSProperties
  layout: ResponsiveGridLayout
}

function normalizeBreakpoints(
  breakpoints: ResponsiveBreakpoint[]
): ResponsiveBreakpoint[] {
  return [...breakpoints].sort((a, b) => a.minWidth - b.minWidth)
}

export function useResponsiveGrid(
  options: UseResponsiveGridOptions
): UseResponsiveGridReturn {
  const { breakpoints, gap = 16, defaultColumns = 1, layout = "flex" } = options

  const normalizedBreakpoints = React.useMemo(
    () => normalizeBreakpoints(breakpoints),
    [breakpoints]
  )

  const getColumnsForWidth = React.useCallback(
    (width: number): number => {
      let columns = defaultColumns

      for (const breakpoint of normalizedBreakpoints) {
        if (width >= breakpoint.minWidth) {
          columns = breakpoint.columns
        } else {
          break
        }
      }

      return Math.max(columns, 1)
    },
    [defaultColumns, normalizedBreakpoints]
  )

  const [columns, setColumns] = React.useState(() => {
    if (typeof window === "undefined") {
      return defaultColumns
    }
    return getColumnsForWidth(window.innerWidth)
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setColumns(getColumnsForWidth(window.innerWidth))
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [getColumnsForWidth])

  const { containerStyle, itemStyle } = React.useMemo(() => {
    if (layout === "masonry") {
      return {
        containerStyle: {
          columnCount: columns,
          columnGap: gap,
        } satisfies React.CSSProperties,
        itemStyle: {
          width: "100%",
          breakInside: "avoid",
          display: "block",
          marginBottom: gap,
        } satisfies React.CSSProperties,
      }
    }

    const width =
      columns <= 1
        ? "100%"
        : `calc((100% - ${(columns - 1) * gap}px) / ${columns})`

    return {
      containerStyle: {
        display: "flex",
        flexWrap: "wrap",
        gap,
      } satisfies React.CSSProperties,
      itemStyle: {
        width,
        flex: `0 0 ${width}`,
        marginBottom: gap,
      } satisfies React.CSSProperties,
    }
  }, [columns, gap, layout])

  return {
    columns,
    gap,
    layout,
    containerStyle,
    itemStyle,
  }
}
