import * as React from "react"

export type DiffChangeType = "added" | "removed" | "changed" | "unchanged"

export type DiffKind = "text" | "json"

export interface TextDiffLine {
  leftIndex: number | null
  rightIndex: number | null
  leftValue: string | null
  rightValue: string | null
  type: DiffChangeType
}

export interface JsonDiffEntry {
  path: string
  leftValue: unknown
  rightValue: unknown
  type: Exclude<DiffChangeType, "unchanged">
}

export interface UseDiffEditorResult<T = unknown> {
  kind: DiffKind
  diffs: TextDiffLine[] | JsonDiffEntry[]
  merge: {
    acceptLeft(): T
    acceptRight(): T
    custom<TResult = T>(
      resolver: (context: {
        kind: DiffKind
        left: T
        right: T
        diffs: TextDiffLine[] | JsonDiffEntry[]
      }) => TResult
    ): TResult
  }
}

function isTextPair(
  left: unknown,
  right: unknown
): left is string & typeof right {
  return typeof left === "string" && typeof right === "string"
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

function isJsonLike(value: unknown): boolean {
  if (value === null) return true
  if (typeof value === "string") return false
  if (typeof value === "number" || typeof value === "boolean") return true
  if (Array.isArray(value)) return true
  if (isPlainObject(value)) return true
  return false
}

function buildPath(parent: string, key: string | number): string {
  if (typeof key === "number") {
    return parent ? `${parent}[${key}]` : `[${key}]`
  }
  return parent ? `${parent}.${key}` : key
}

function diffJsonInternal(
  left: unknown,
  right: unknown,
  path: string,
  acc: JsonDiffEntry[]
) {
  if (Object.is(left, right)) {
    return
  }

  const leftIsArray = Array.isArray(left)
  const rightIsArray = Array.isArray(right)

  if (leftIsArray && rightIsArray) {
    const max = Math.max(left.length, right.length)
    for (let index = 0; index < max; index++) {
      const l = left[index]
      const r = right[index]
      const nextPath = buildPath(path, index)
      if (index >= left.length) {
        acc.push({
          path: nextPath,
          leftValue: undefined,
          rightValue: r,
          type: "added",
        })
      } else if (index >= right.length) {
        acc.push({
          path: nextPath,
          leftValue: l,
          rightValue: undefined,
          type: "removed",
        })
      } else {
        diffJsonInternal(l, r, nextPath, acc)
      }
    }
    return
  }

  const leftIsObject = isPlainObject(left)
  const rightIsObject = isPlainObject(right)

  if (leftIsObject && rightIsObject) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)])
    for (const key of keys) {
      const l = (left as Record<string, unknown>)[key]
      const r = (right as Record<string, unknown>)[key]
      const nextPath = buildPath(path, key)

      if (typeof l === "undefined" && typeof r !== "undefined") {
        acc.push({
          path: nextPath,
          leftValue: undefined,
          rightValue: r,
          type: "added",
        })
      } else if (typeof r === "undefined" && typeof l !== "undefined") {
        acc.push({
          path: nextPath,
          leftValue: l,
          rightValue: undefined,
          type: "removed",
        })
      } else {
        diffJsonInternal(l, r, nextPath, acc)
      }
    }
    return
  }

  acc.push({
    path,
    leftValue: left,
    rightValue: right,
    type: "changed",
  })
}

function diffJson(left: unknown, right: unknown): JsonDiffEntry[] {
  const acc: JsonDiffEntry[] = []
  diffJsonInternal(left, right, "", acc)
  return acc
}

function diffText(left: string, right: string): TextDiffLine[] {
  const leftLines = left.split(/\r?\n/)
  const rightLines = right.split(/\r?\n/)
  const max = Math.max(leftLines.length, rightLines.length)
  const result: TextDiffLine[] = []

  for (let index = 0; index < max; index++) {
    const leftValue = index < leftLines.length ? leftLines[index] : null
    const rightValue = index < rightLines.length ? rightLines[index] : null

    let type: DiffChangeType
    if (leftValue === null && rightValue !== null) {
      type = "added"
    } else if (leftValue !== null && rightValue === null) {
      type = "removed"
    } else if (leftValue === rightValue) {
      type = "unchanged"
    } else {
      type = "changed"
    }

    result.push({
      leftIndex: leftValue === null ? null : index,
      rightIndex: rightValue === null ? null : index,
      leftValue,
      rightValue,
      type,
    })
  }

  return result
}

export function useDiffEditor<T = unknown>(
  left: T,
  right: T
): UseDiffEditorResult<T> {
  const kind: DiffKind = React.useMemo(() => {
    if (isTextPair(left, right)) return "text"
    if (isJsonLike(left) && isJsonLike(right)) return "json"
    return "text"
  }, [left, right])

  const diffs = React.useMemo<TextDiffLine[] | JsonDiffEntry[]>(() => {
    if (kind === "text") {
      const leftText = isTextPair(left, right)
        ? String(left)
        : JSON.stringify(left, null, 2)
      const rightText = isTextPair(left, right)
        ? String(right)
        : JSON.stringify(right, null, 2)
      return diffText(leftText, rightText)
    }
    return diffJson(left, right)
  }, [kind, left, right])

  const merge = React.useMemo<UseDiffEditorResult<T>["merge"]>(
    () => ({
      acceptLeft: () => left,
      acceptRight: () => right,
      custom: (resolver) =>
        resolver({
          kind,
          left,
          right,
          diffs,
        }),
    }),
    [diffs, kind, left, right]
  )

  return React.useMemo(
    () => ({
      kind,
      diffs,
      merge,
    }),
    [kind, diffs, merge]
  )
}
