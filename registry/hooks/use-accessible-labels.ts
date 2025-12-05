import * as React from "react"

type StringOrFn = string | (() => string)

export interface UseAccessibleLabelsOptions {
  id?: string
  label?: string
  labelledBy?: string
  description?: string
  describedBy?: string
  fallback?: StringOrFn
  prefix?: string
  warn?: boolean
}

export interface UseAccessibleLabelsResult {
  id: string
  ariaProps: {
    id: string
    "aria-label"?: string
    "aria-labelledby"?: string
    "aria-describedby"?: string
    "aria-description"?: string
  }
  labelText?: string
  descriptionText?: string
  missingLabel: boolean
}

const DEFAULT_PREFIX = "usekit-a11y"
const isDev = process.env.NODE_ENV !== "production"

export function useAccessibleLabels(
  options: UseAccessibleLabelsOptions
): UseAccessibleLabelsResult {
  const {
    id,
    label,
    labelledBy,
    description,
    describedBy,
    fallback,
    prefix = DEFAULT_PREFIX,
    warn = true,
  } = options

  const reactId = React.useId()
  const generatedId = React.useMemo(() => {
    if (id) return id
    const sanitized = reactId.replace(/:/g, "")
    return `${prefix}-${sanitized}`
  }, [id, prefix, reactId])

  const labelText = React.useMemo(() => {
    if (label && label.trim().length) {
      return label.trim()
    }
    if (fallback) {
      const value = typeof fallback === "function" ? fallback() : fallback
      return value?.trim() || ""
    }
    return ""
  }, [label, fallback])

  const descriptionText = React.useMemo(
    () => description?.trim() || "",
    [description]
  )

  const missingLabel = !labelText && !labelledBy

  React.useEffect(() => {
    if (!isDev || !warn) return
    if (missingLabel) {
      // eslint-disable-next-line no-console
      console.warn(
        `[useAccessibleLabels] Missing label or labelledBy for control "${generatedId}". Provide a label, labelledBy, or fallback text to ensure accessibility.`
      )
    }
  }, [missingLabel, warn, generatedId])

  const ariaProps = React.useMemo(() => {
    const props: UseAccessibleLabelsResult["ariaProps"] = {
      id: generatedId,
    }

    if (labelledBy) {
      props["aria-labelledby"] = labelledBy
    } else if (labelText) {
      props["aria-label"] = labelText
    }

    if (describedBy) {
      props["aria-describedby"] = describedBy
    } else if (descriptionText) {
      props["aria-description"] = descriptionText
    }

    return props
  }, [generatedId, labelledBy, labelText, describedBy, descriptionText])

  return {
    id: generatedId,
    ariaProps,
    labelText: labelText || undefined,
    descriptionText: descriptionText || undefined,
    missingLabel,
  }
}
