"use client"

import * as React from "react"
import { Braces, Code2, GitMerge } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  JsonDiffEntry,
  TextDiffLine,
  useDiffEditor,
} from "registry/hooks/use-diff-editor"

type Mode = "text" | "json"

function formatJson(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input), null, 2)
  } catch {
    return input
  }
}

export default function UseDiffEditorDemo() {
  const [mode, setMode] = React.useState<Mode>("text")

  const [leftText, setLeftText] = React.useState(
    [
      "Welcome to the editor.",
      "This is the original copy.",
      "Review before publishing.",
    ].join("\n")
  )
  const [rightText, setRightText] = React.useState(
    [
      "Welcome to the editor.",
      "This is the updated copy with tweaks.",
      "Review before publishing to production.",
    ].join("\n")
  )

  const [leftJsonInput, setLeftJsonInput] = React.useState(
    JSON.stringify(
      {
        title: "Landing page",
        status: "draft",
        meta: { locale: "en-US", slug: "landing" },
      },
      null,
      2
    )
  )
  const [rightJsonInput, setRightJsonInput] = React.useState(
    JSON.stringify(
      {
        title: "Landing page (Spring launch)",
        status: "review",
        meta: { locale: "en-US", slug: "landing-spring" },
      },
      null,
      2
    )
  )

  const leftValue = React.useMemo(() => {
    if (mode === "text") return leftText
    try {
      return JSON.parse(leftJsonInput)
    } catch {
      return leftJsonInput
    }
  }, [leftJsonInput, leftText, mode])

  const rightValue = React.useMemo(() => {
    if (mode === "text") return rightText
    try {
      return JSON.parse(rightJsonInput)
    } catch {
      return rightJsonInput
    }
  }, [rightJsonInput, rightText, mode])

  const { kind, diffs, merge } = useDiffEditor(leftValue, rightValue)

  const [mergedPreview, setMergedPreview] = React.useState<string>("")

  const handleAcceptLeft = () => {
    const next = merge.acceptLeft()
    setMergedPreview(
      typeof next === "string" ? next : JSON.stringify(next, null, 2)
    )
  }

  const handleAcceptRight = () => {
    const next = merge.acceptRight()
    setMergedPreview(
      typeof next === "string" ? next : JSON.stringify(next, null, 2)
    )
  }

  const handleSmartMerge = () => {
    const next = merge.custom((context) => {
      if (context.kind === "json") {
        const base = structuredClone
          ? structuredClone(context.left)
          : JSON.parse(JSON.stringify(context.left))

        ;(context.diffs as JsonDiffEntry[]).forEach((entry) => {
          const segments = entry.path
            ? entry.path.split(".").flatMap((segment) => {
                const arrayMatch = segment.match(/(.*)\[(\d+)\]/)
                if (!arrayMatch) return [segment]
                const [, key, index] = arrayMatch
                return key ? [key, Number(index)] : [Number(index)]
              })
            : []

          let cursor: any = base
          for (let index = 0; index < segments.length - 1; index++) {
            const key = segments[index]
            if (cursor == null) return
            cursor = cursor[key as keyof typeof cursor]
          }

          const finalKey = segments[segments.length - 1]
          if (cursor == null || typeof finalKey === "undefined") return

          if (entry.type === "removed") {
            if (Array.isArray(cursor) && typeof finalKey === "number") {
              cursor.splice(finalKey, 1)
            } else {
              delete cursor[finalKey as keyof typeof cursor]
            }
          } else {
            cursor[finalKey as keyof typeof cursor] = entry.rightValue
          }
        })

        return base
      }

      return context.right
    })

    setMergedPreview(
      typeof next === "string" ? next : JSON.stringify(next, null, 2)
    )
  }

  const handleReset = () => {
    setLeftText("")
    setRightText("")
    setLeftJsonInput("")
    setRightJsonInput("")
    setMergedPreview("")
  }

  const textDiffs = kind === "text" ? (diffs as TextDiffLine[]) : null
  const jsonDiffs = kind === "json" ? (diffs as JsonDiffEntry[]) : null

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col justify-between gap-3 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitMerge className="h-5 w-5" />
              Diff Editor
            </CardTitle>
            <CardDescription>
              Compare left/right content and drive review flows for text and
              JSON.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {kind === "text" ? (
                <>
                  <Code2 className="h-3.5 w-3.5" />
                  Text mode
                </>
              ) : (
                <>
                  <Braces className="h-3.5 w-3.5" />
                  JSON mode
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs
            value={mode}
            onValueChange={(next) => setMode(next as Mode)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="left">Left (current)</Label>
              <Textarea
                id="left"
                rows={10}
                value={mode === "text" ? leftText : leftJsonInput}
                onChange={(event) =>
                  mode === "text"
                    ? setLeftText(event.target.value)
                    : setLeftJsonInput(event.target.value)
                }
                placeholder={
                  mode === "text" ? "Enter text here..." : "Enter JSON here..."
                }
                className="h-[200px] resize-none font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="right">Right (incoming)</Label>
              <Textarea
                id="right"
                rows={10}
                value={mode === "text" ? rightText : rightJsonInput}
                onChange={(event) =>
                  mode === "text"
                    ? setRightText(event.target.value)
                    : setRightJsonInput(event.target.value)
                }
                placeholder={
                  mode === "text" ? "Enter text here..." : "Enter JSON here..."
                }
                className="h-[200px] resize-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAcceptLeft}
              disabled={
                !leftText && !rightText && !leftJsonInput && !rightJsonInput
              }
            >
              Accept left
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAcceptRight}
              disabled={
                !leftText && !rightText && !leftJsonInput && !rightJsonInput
              }
            >
              Accept right
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSmartMerge}
              disabled={
                !leftText && !rightText && !leftJsonInput && !rightJsonInput
              }
            >
              Smart merge
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleReset}
              disabled={
                !leftText && !rightText && !leftJsonInput && !rightJsonInput
              }
            >
              Reset
            </Button>
          </div>

          {kind === "text" &&
            textDiffs &&
            textDiffs.some((line) => line.leftValue || line.rightValue) && (
              <div className="space-y-2">
                <Label>Line diff</Label>
                <div className="grid max-h-48 gap-2 overflow-auto rounded-md border bg-muted/40 p-2 md:grid-cols-2">
                  {["Left", "Right"].map((side) => (
                    <div key={side} className="space-y-1 font-mono text-xs">
                      <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        {side}
                      </div>
                      {textDiffs.map((line, index) => {
                        const value =
                          side === "Left" ? line.leftValue : line.rightValue
                        const hasChange =
                          line.type === "added" ||
                          line.type === "removed" ||
                          line.type === "changed"

                        return (
                          <div
                            key={`${side}-${index}`}
                            className={cn("flex gap-2 rounded px-2 py-0.5", {
                              "bg-amber-500/10":
                                hasChange && !!value && side === "Left",
                              "bg-emerald-500/10":
                                hasChange && !!value && side === "Right",
                            })}
                          >
                            <span className="w-8 text-right text-[0.65rem] text-muted-foreground">
                              {side === "Left"
                                ? line.leftIndex !== null
                                  ? line.leftIndex + 1
                                  : ""
                                : line.rightIndex !== null
                                  ? line.rightIndex + 1
                                  : ""}
                            </span>
                            <span className="flex-1 whitespace-pre-wrap">
                              {value ?? ""}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {kind === "json" && jsonDiffs && (
            <div className="space-y-2">
              <Label>Changed fields</Label>
              {jsonDiffs.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No structural differences detected.
                </p>
              ) : (
                <div className="max-h-48 space-y-1 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-xs">
                  {jsonDiffs.map((entry) => (
                    <div
                      key={entry.path || "(root)"}
                      className="flex items-start gap-2 rounded px-2 py-1"
                    >
                      <Badge
                        variant={
                          entry.type === "added"
                            ? "default"
                            : entry.type === "removed"
                              ? "destructive"
                              : "outline"
                        }
                        className="mt-px h-4 text-[0.6rem]"
                      >
                        {entry.type}
                      </Badge>
                      <div className="space-y-0.5">
                        <div className="text-[0.7rem] font-semibold">
                          {entry.path || "(root)"}
                        </div>
                        <div className="grid gap-1 md:grid-cols-2">
                          <div className="truncate text-[0.7rem] text-muted-foreground">
                            L:{" "}
                            {typeof entry.leftValue === "string"
                              ? entry.leftValue
                              : formatJson(JSON.stringify(entry.leftValue))}
                          </div>
                          <div className="truncate text-[0.7rem] text-muted-foreground">
                            R:{" "}
                            {typeof entry.rightValue === "string"
                              ? entry.rightValue
                              : formatJson(JSON.stringify(entry.rightValue))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mergedPreview && (
            <div className="space-y-2">
              <Label>Merged preview</Label>
              <Textarea
                readOnly
                rows={6}
                value={mergedPreview}
                className="h-[200px] resize-none font-mono text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
