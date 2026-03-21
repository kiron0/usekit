import * as React from "react"

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface UseBreadcrumbsOptions {
  items?: BreadcrumbItem[]
  generateLabel?: (segment: string, index: number, segments: string[]) => string
  autoGenerate?: boolean
  basePath?: string
  maxDepth?: number
  navigate?: (href: string) => void
  getPathname?: () => string
}

export interface UseBreadcrumbsReturn {
  items: BreadcrumbItem[]
  push: (item: BreadcrumbItem) => void
  pop: () => void
  replace: (item: BreadcrumbItem) => void
  setItems: (items: BreadcrumbItem[]) => void
  reset: () => void
  navigate: (href: string) => void
}

function defaultGenerateLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function generateBreadcrumbsFromPath(
  pathname: string,
  generateLabel: (segment: string, index: number, segments: string[]) => string,
  basePath?: string,
  maxDepth?: number
): BreadcrumbItem[] {
  let path = pathname

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || "/"
  }

  const segments = path.split("/").filter(Boolean)
  const depth = Math.min(segments.length, maxDepth ?? 10)

  const items: BreadcrumbItem[] = [
    {
      label: "Home",
      href: basePath || "/",
    },
  ]

  let currentPath = basePath || ""

  for (let i = 0; i < depth; i++) {
    const segment = segments[i]!
    currentPath = `${currentPath}/${segment}`
    items.push({
      label: generateLabel(segment, i, segments),
      href: currentPath,
    })
  }

  return items
}

function getCurrentPathname(getPathname?: () => string): string {
  if (typeof window === "undefined") return "/"
  if (getPathname) return getPathname()
  return window.location.pathname
}

export function useBreadcrumbs(
  options: UseBreadcrumbsOptions = {}
): UseBreadcrumbsReturn {
  const {
    items: initialItems,
    generateLabel = defaultGenerateLabel,
    autoGenerate = true,
    basePath,
    maxDepth = 10,
    navigate: customNavigate,
    getPathname,
  } = options

  const [pathname, setPathname] = React.useState(() =>
    getCurrentPathname(getPathname)
  )

  const [items, setItemsState] = React.useState<BreadcrumbItem[]>(() => {
    if (initialItems) {
      return initialItems
    }
    if (autoGenerate) {
      return generateBreadcrumbsFromPath(
        pathname,
        generateLabel,
        basePath,
        maxDepth
      )
    }
    return []
  })

  const initialItemsRef = React.useRef(initialItems)
  const pathnameRef = React.useRef(pathname)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const updatePathname = () => {
      const current = getCurrentPathname(getPathname)
      if (current !== pathnameRef.current) {
        pathnameRef.current = current
        setPathname(current)

        if (autoGenerate) {
          const generated = generateBreadcrumbsFromPath(
            current,
            generateLabel,
            basePath,
            maxDepth
          )
          setItemsState(generated)
        }
      }
    }

    updatePathname()

    const handlePopState = () => {
      updatePathname()
    }

    window.addEventListener("popstate", handlePopState)

    const interval = setInterval(updatePathname, 100)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      clearInterval(interval)
    }
  }, [autoGenerate, generateLabel, basePath, maxDepth, getPathname])

  const push = React.useCallback((item: BreadcrumbItem) => {
    setItemsState((prev) => [...prev, item])
  }, [])

  const pop = React.useCallback(() => {
    setItemsState((prev) => {
      if (prev.length <= 1) return prev
      return prev.slice(0, -1)
    })
  }, [])

  const replace = React.useCallback((item: BreadcrumbItem) => {
    setItemsState((prev) => {
      if (prev.length === 0) return [item]
      return [...prev.slice(0, -1), item]
    })
  }, [])

  const setItems = React.useCallback((newItems: BreadcrumbItem[]) => {
    setItemsState(newItems)
  }, [])

  const reset = React.useCallback(() => {
    if (initialItemsRef.current) {
      setItemsState(initialItemsRef.current)
    } else if (autoGenerate) {
      const current = getCurrentPathname(getPathname)
      const generated = generateBreadcrumbsFromPath(
        current,
        generateLabel,
        basePath,
        maxDepth
      )
      setItemsState(generated)
    } else {
      setItemsState([])
    }
  }, [autoGenerate, generateLabel, basePath, maxDepth, getPathname])

  const navigate = React.useCallback(
    (href: string) => {
      if (customNavigate) {
        customNavigate(href)
      } else if (typeof window !== "undefined") {
        window.location.href = href
      }
    },
    [customNavigate]
  )

  return {
    items,
    push,
    pop,
    replace,
    setItems,
    reset,
    navigate,
  }
}
