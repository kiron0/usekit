"use client"

import * as React from "react"
import { Activity, AlertCircle, Wifi, WifiOff } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Slider } from "@/components/ui/slider"
import { useNetworkQuality } from "registry/hooks/use-network-quality"

export default function UseNetworkQualityDemo() {
  const [sampleInterval, setSampleInterval] = React.useState(5000)
  const [enabled, setEnabled] = React.useState(true)

  const { rtt, downKbps, upKbps, category, isMeasuring, error } =
    useNetworkQuality({
      sampleInterval,
      enabled,
    })

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "excellent":
        return "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
      case "good":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30"
      case "fair":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30"
      case "poor":
        return "bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400 hover:bg-gray-500/30"
    }
  }

  const formatKbps = (kbps: number | null): string => {
    if (kbps === null) return "N/A"
    if (kbps >= 1000) return `${(kbps / 1000).toFixed(2)} Mbps`
    return `${Math.round(kbps)} Kbps`
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Network Quality
            </CardTitle>
            <CardDescription>
              Real-time network performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Category</span>
              <Badge className={getCategoryColor(category)}>
                {category.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">RTT</span>
                <span className="font-mono text-sm">
                  {rtt !== null ? `${Math.round(rtt)} ms` : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Download Speed
                </span>
                <span className="font-mono text-sm">
                  {formatKbps(downKbps)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Upload Speed
                </span>
                <span className="font-mono text-sm">{formatKbps(upKbps)}</span>
              </div>
            </div>

            {isMeasuring && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 animate-pulse" />
                Measuring...
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure measurement behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sample-interval">
                Sample Interval: {sampleInterval / 1000}s
              </Label>
              <Slider
                min={2000}
                max={30000}
                step={1000}
                value={[sampleInterval]}
                onValueChange={(value) => setSampleInterval(value[0])}
                className="w-full"
                disabled={!enabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2s</span>
                <span>30s</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Enable Monitoring</span>
              <Button
                variant={enabled ? "default" : "outline"}
                size="sm"
                onClick={() => setEnabled(!enabled)}
              >
                {enabled ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    Enabled
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4" />
                    Disabled
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Thresholds</CardTitle>
          <CardDescription>How network quality is categorized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Excellent</span>
              </div>
              <p className="text-xs text-muted-foreground">
                RTT &lt; 50ms
                <br />
                Down &gt; 5 Mbps
                <br />
                Up &gt; 2 Mbps
              </p>
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Good</span>
              </div>
              <p className="text-xs text-muted-foreground">
                RTT &lt; 100ms
                <br />
                Down &gt; 2 Mbps
                <br />
                Up &gt; 1 Mbps
              </p>
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Fair</span>
              </div>
              <p className="text-xs text-muted-foreground">
                RTT &lt; 200ms
                <br />
                Down &gt; 500 Kbps
                <br />
                Up &gt; 200 Kbps
              </p>
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Poor</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Below fair thresholds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
