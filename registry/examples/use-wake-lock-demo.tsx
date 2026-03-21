"use client"

import { MoonStar, Power, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useWakeLock } from "registry/hooks/use-wake-lock"

export default function UseWakeLockDemo() {
  const { isSupported, isActive, error, request, release } = useWakeLock()

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Wake Lock
            </CardTitle>
            <CardDescription>
              Keep the screen awake during checkout, scanning, reading, or live
              dashboards without building the visibility recovery logic
              yourself.
            </CardDescription>
          </div>
          <Badge
            variant={isSupported ? "default" : "outline"}
            className="flex items-center gap-1"
          >
            <Power className="h-3.5 w-3.5" />
            {isSupported ? "Supported" : "Unsupported"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold">
                {isActive ? "Screen awake" : "Released"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Best use
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Kiosks, map navigation, barcode scanning, and recipe readers.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Behavior
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Reacquires automatically when the tab becomes visible again.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void request()}
              disabled={!isSupported || isActive}
            >
              <Zap className="h-4 w-4" />
              Enable wake lock
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void release()}
              disabled={!isActive}
            >
              <MoonStar className="h-4 w-4" />
              Release
            </Button>
          </div>

          {error && (
            <p className="text-xs text-destructive">
              {error.message || "Failed to manage wake lock."}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Browser support is limited, so keep a graceful fallback when the API
            is unavailable.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
