"use client"

import * as React from "react"
import { Eye, Timer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useViewTime } from "registry/hooks/use-view-time"

const ITEMS = [
  {
    id: "hero",
    label: "Hero section",
    description: "Top-of-page hero with primary CTA and headline copy.",
  },
  {
    id: "features",
    label: "Features list",
    description: "Modules explaining the main product value props.",
  },
  {
    id: "pricing",
    label: "Pricing table",
    description: "Plans, tiers, and billing details for the product.",
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Common questions and answers near the footer.",
  },
]

function SectionRow({
  id,
  label,
  description,
}: {
  id: string
  label: string
  description: string
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { secondsViewed } = useViewTime(ref, { threshold: 0.4 })

  return (
    <div
      ref={ref}
      className="flex h-40 flex-col justify-between rounded-md border bg-background px-4 py-3 text-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">#{id}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center justify-end">
        <Badge variant="outline" className="gap-1 text-xs">
          <Timer className="h-3 w-3" />
          {secondsViewed.toString().padStart(2, "0")}s viewed
        </Badge>
      </div>
    </div>
  )
}

export default function UseViewTimeDemo() {
  const [key, setKey] = React.useState(0)

  const handleReset = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              View Time Tracker
            </CardTitle>
            <CardDescription>
              Scroll the list and see how long each section has actually been on
              screen.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleReset}
          >
            Reset timers
          </Button>
        </CardHeader>
        <CardContent key={key} className="space-y-4 p-0">
          <ScrollArea className="h-60 rounded-md border bg-muted/40 p-3">
            <div className="space-y-3">
              {ITEMS.map((item) => (
                <SectionRow
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </ScrollArea>
          <p className="text-xs text-muted-foreground">
            Timers only advance when a row is at least 40% visible and the
            document tab is active.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
