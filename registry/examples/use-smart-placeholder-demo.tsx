"use client"

import * as React from "react"
import { RefreshCw, Sparkles, Type } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSmartPlaceholder } from "registry/hooks/use-smart-placeholder"

const TYPES = ["text", "list", "card", "avatar", "thumbnail"] as const

export default function UseSmartPlaceholderDemo() {
  const [variant, setVariant] = React.useState<(typeof TYPES)[number]>("card")
  const [seed, setSeed] = React.useState(() => Math.random())

  const placeholder = useSmartPlaceholder(variant, {
    tone: "soft",
    lines: variant === "text" ? 4 : 3,
  })

  React.useEffect(() => {
    setSeed(Math.random())
  }, [variant])

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col gap-3 p-0">
          <div>
            <CardTitle>Smart Placeholders</CardTitle>
            <p className="text-sm text-muted-foreground">
              Switch between skeleton types without creating new markup.
            </p>
          </div>
          <Badge variant="secondary">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Seed {seed.toFixed(3)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="flex gap-2 overflow-x-auto">
            {TYPES.map((type) => {
              const isActive = type === variant
              return (
                <Button
                  key={type}
                  type="button"
                  variant={isActive ? "secondary" : "outline"}
                  size="sm"
                  className="shrink-0 capitalize"
                  onClick={() => setVariant(type)}
                >
                  {type}
                </Button>
              )
            })}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-4">
              {placeholder.render()}
            </div>
            <p className="text-xs text-muted-foreground">
              Rendering <code>{variant}</code> skeleton. Use the buttons to
              preview each preset.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSeed(Math.random())}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Randomize widths
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setVariant("text")}
            >
              <Type className="mr-2 h-3.5 w-3.5" />
              Focus on text lines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
