"use client"

import * as React from "react"

export type PayloadDiffChangeType = "added" | "removed" | "changed"

type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date

type PayloadPathInternal<T, Prefix extends string = ""> = T extends Primitive
  ? never
  : T extends (infer U)[]
    ? PayloadPathInternal<U, Prefix>
    : {
        [K in Extract<keyof T, string>]:
          | (Prefix extends "" ? K : `${Prefix}.${K}`)
          | PayloadPathInternal<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
      }[Extract<keyof T, string>]

export type PayloadPath<T> = Extract<PayloadPathInternal<T>, string>

export interface PayloadDiffEntry<T> {
  path: PayloadPath<T>
  dbValue: unknown
  inputValue: unknown
  type: PayloadDiffChangeType
}

export interface UsePayloadDiffGuardOptions<T> {
  ignorePath?: (path: PayloadPath<T>, entry: PayloadDiffEntry<T>) => boolean
}

export interface UsePayloadDiffGuardResult<T> {
  hasChanges: boolean
  isPristine: boolean
  diffs: PayloadDiffEntry<T>[]
  changedPaths: PayloadPath<T>[]
  added: PayloadDiffEntry<T>[]
  removed: PayloadDiffEntry<T>[]
  changed: PayloadDiffEntry<T>[]
  preventSubmit: (onSubmit: () => void | Promise<void>) => Promise<boolean>
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

function buildPath(parent: string, key: string | number): string {
  if (typeof key === "number") {
    return parent ? `${parent}[${key}]` : `[${key}]`
  }
  return parent ? `${parent}.${key}` : key
}

function diffJsonInternal(
  dbValue: unknown,
  inputValue: unknown,
  path: string,
  acc: {
    path: string
    dbValue: unknown
    inputValue: unknown
    type: PayloadDiffChangeType
  }[]
) {
  if (Object.is(dbValue, inputValue)) {
    return
  }

  const dbIsArray = Array.isArray(dbValue)
  const inputIsArray = Array.isArray(inputValue)

  if (dbIsArray && inputIsArray) {
    const max = Math.max(dbValue.length, inputValue.length)
    for (let index = 0; index < max; index++) {
      const left = dbValue[index]
      const right = inputValue[index]
      const nextPath = buildPath(path, index)

      if (index >= dbValue.length) {
        acc.push({
          path: nextPath,
          dbValue: undefined,
          inputValue: right,
          type: "added",
        })
      } else if (index >= inputValue.length) {
        acc.push({
          path: nextPath,
          dbValue: left,
          inputValue: undefined,
          type: "removed",
        })
      } else {
        diffJsonInternal(left, right, nextPath, acc)
      }
    }
    return
  }

  const dbIsObject = isPlainObject(dbValue)
  const inputIsObject = isPlainObject(inputValue)

  if (dbIsObject && inputIsObject) {
    const keys = new Set([...Object.keys(dbValue), ...Object.keys(inputValue)])

    for (const key of keys) {
      const left = (dbValue as Record<string, unknown>)[key]
      const right = (inputValue as Record<string, unknown>)[key]
      const nextPath = buildPath(path, key)

      if (typeof left === "undefined" && typeof right !== "undefined") {
        acc.push({
          path: nextPath,
          dbValue: undefined,
          inputValue: right,
          type: "added",
        })
      } else if (typeof right === "undefined" && typeof left !== "undefined") {
        acc.push({
          path: nextPath,
          dbValue: left,
          inputValue: undefined,
          type: "removed",
        })
      } else {
        diffJsonInternal(left, right, nextPath, acc)
      }
    }
    return
  }

  acc.push({
    path,
    dbValue,
    inputValue,
    type: "changed",
  })
}

function diffJson(dbPayload: unknown, inputPayload: unknown) {
  const acc: {
    path: string
    dbValue: unknown
    inputValue: unknown
    type: PayloadDiffChangeType
  }[] = []
  diffJsonInternal(dbPayload, inputPayload, "", acc)
  return acc
}

export function usePayloadDiffGuard<T = unknown>(
  dbPayload: T,
  inputPayload: T,
  options: UsePayloadDiffGuardOptions<T> = {}
): UsePayloadDiffGuardResult<T> {
  const { ignorePath } = options

  const rawDiffs = React.useMemo(
    () => diffJson(dbPayload, inputPayload) as PayloadDiffEntry<T>[],
    [dbPayload, inputPayload]
  )

  const diffs = React.useMemo(() => {
    if (!ignorePath) return rawDiffs
    return rawDiffs.filter((entry) => !ignorePath(entry.path, entry))
  }, [ignorePath, rawDiffs])

  const hasChanges = diffs.length > 0
  const isPristine = !hasChanges

  const { added, removed, changed, changedPaths } = React.useMemo(() => {
    const added: PayloadDiffEntry<T>[] = []
    const removed: PayloadDiffEntry<T>[] = []
    const changed: PayloadDiffEntry<T>[] = []
    const paths = new Set<PayloadPath<T>>()

    for (const entry of diffs) {
      paths.add(entry.path as PayloadPath<T>)
      if (entry.type === "added") added.push(entry)
      else if (entry.type === "removed") removed.push(entry)
      else changed.push(entry)
    }

    return {
      added,
      removed,
      changed,
      changedPaths: Array.from(paths),
    }
  }, [diffs])

  const preventSubmit = React.useCallback(
    async (onSubmit: () => void | Promise<void>) => {
      if (!hasChanges) {
        return false
      }
      await onSubmit()
      return true
    },
    [hasChanges]
  )

  return React.useMemo(
    () => ({
      hasChanges,
      isPristine,
      diffs,
      changedPaths,
      added,
      removed,
      changed,
      preventSubmit,
    }),
    [
      added,
      changed,
      changedPaths,
      diffs,
      hasChanges,
      isPristine,
      preventSubmit,
      removed,
    ]
  )
}
