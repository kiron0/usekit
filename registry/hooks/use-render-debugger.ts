import * as React from "react"

export function useRenderDebugger<TProps extends Record<string, unknown>>(
  componentName: string,
  props: TProps,
  options?: {
    trackOnly?: Array<keyof TProps>
    logger?: (
      message: string,
      changes: Record<string, { from: unknown; to: unknown }>
    ) => void
  }
): void {
  const previousProps = React.useRef<TProps>(props)

  React.useEffect(() => {
    const { trackOnly, logger = console.log } = options || {}

    const changedProps = Object.entries(props).reduce<
      Record<string, { from: unknown; to: unknown }>
    >((acc, [key, value]) => {
      if (trackOnly && !trackOnly.includes(key)) return acc
      if (previousProps.current[key] !== value) {
        acc[key] = { from: previousProps.current[key], to: value }
      }
      return acc
    }, {})

    if (Object.keys(changedProps).length > 0) {
      logger(
        `[RenderDebugger] ${componentName} re-rendered due to:`,
        changedProps
      )
    }

    previousProps.current = props
  }, [componentName, props, options])
}
