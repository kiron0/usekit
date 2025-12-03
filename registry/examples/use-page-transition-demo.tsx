"use client"

import * as React from "react"
import { ArrowRight, Loader2, Route } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePageTransition } from "registry/hooks/use-page-transition"

export default function UsePageTransitionDemo() {
  const { isTransitioning } = usePageTransition()
  const [simulatedRoute, setSimulatedRoute] = React.useState("/dashboard")

  const simulateSpaNavigation = () => {
    const nextRoute =
      simulatedRoute === "/dashboard" ? "/settings" : "/dashboard"
    setSimulatedRoute(nextRoute)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("route", nextRoute)
      window.history.pushState({}, "", url.toString())
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card className="relative overflow-hidden">
        {isTransitioning && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-medium">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Navigating…
            </div>
          </div>
        )}

        <CardHeader className="flex flex-col justify-between gap-3 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Page Transition
            </CardTitle>
            <CardDescription>
              Track SPA navigations and browser-driven transitions to show
              optimistic skeletons or spinners.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isTransitioning ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isTransitioning ? "Transitioning" : "Idle"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Simulated route:{" "}
              <span className="font-mono text-foreground">
                {simulatedRoute}
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={simulateSpaNavigation}
            >
              Navigate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-xs">
              <div className="font-semibold">How it works</div>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  Listens to history.pushState / replaceState and popstate
                </li>
                <li>Watches pagehide / pageshow and visibility changes</li>
                <li>Debounces transitions with a minimum duration</li>
              </ul>
            </div>
            <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-xs">
              <div className="font-semibold">Typical use-cases</div>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>Show page-level skeletons during SPA route changes</li>
                <li>Dim content while optimistic data loads</li>
                <li>Gate interactions while navigation is in-flight</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
