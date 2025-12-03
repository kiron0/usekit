"use client"

import * as React from "react"
import { BookOpen, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrackedSectionConfig,
  useSectionTracker,
} from "registry/hooks/use-section-tracker"

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    body: "High-level overview of the feature and when to reach for it in your app.",
  },
  {
    id: "setup",
    title: "Setup",
    body: "How to wire the hook into your layout and connect refs to scrollable sections.",
  },
  {
    id: "usage",
    title: "Usage",
    body: "Practical examples of syncing an active section with a sidebar navigation.",
  },
  {
    id: "faq",
    title: "FAQ",
    body: "Common edge cases and how the tracker behaves on fast scrolls and small screens.",
  },
]

export default function UseSectionTrackerDemo() {
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({})

  const trackedSections = React.useMemo<TrackedSectionConfig[]>(
    () =>
      SECTIONS.map((section) => ({
        id: section.id,
        ref: {
          get current() {
            return sectionRefs.current[section.id] ?? null
          },
          set current(node: HTMLElement | null) {
            sectionRefs.current[section.id] = node
          },
        } as React.RefObject<HTMLElement | null>,
      })),
    []
  )

  const { activeSection } = useSectionTracker(trackedSections, {
    rootMargin: "0px 0px -50% 0px",
  })

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[220px,minmax(0,1fr)]">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4" />
            Page outline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => {
                  const node = sectionRefs.current[section.id]
                  if (!node) return
                  node.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
              >
                <span className="truncate text-xs">{section.title}</span>
                {isActive && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-primary" />
                )}
              </button>
            )
          })}
          <div className="pt-2 text-xs text-muted-foreground">
            Active section:{" "}
            <Badge variant="outline" className="ml-1">
              {activeSection ?? "None"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardContent className="pt-4">
          <ScrollArea className="h-64 rounded-md border bg-muted/40 p-4">
            <div className="space-y-8 text-sm">
              {SECTIONS.map((section) => (
                <section
                  key={section.id}
                  ref={(node) => {
                    sectionRefs.current[section.id] = node
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{section.title}</h3>
                    {activeSection === section.id && (
                      <Badge variant="outline" className="text-[0.65rem]">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {section.body}
                  </p>
                  <div className="h-32 rounded-md bg-background/60" />
                </section>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
