"use client"

import { ShieldCheck, ShieldOff } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useConsentGate } from "registry/hooks/use-consent-gate"

const FEATURES = [
  {
    key: "analytics",
    label: "Product analytics",
    description: "Anonymous usage metrics, crash reporting, and funnels.",
  },
  {
    key: "ads",
    label: "Remarketing",
    description: "Ad personalization and conversion tracking pixels.",
  },
  {
    key: "support",
    label: "Live support",
    description: "3rd-party chat widget for real-time conversations.",
  },
]

export default function UseConsentGateDemo() {
  const { allowed, request, revoke, allowedFeatures, allGranted } =
    useConsentGate(FEATURES.map((feature) => feature.key))

  const enableAll = () => FEATURES.forEach(({ key }) => request(key, true))
  const revokeAll = () => FEATURES.forEach(({ key }) => revoke(key))

  return (
    <div className="w-full space-y-4">
      <Card className="w-full">
        <CardHeader className="flex w-full flex-col justify-between gap-4 lg:flex-row">
          <div>
            <CardTitle>Consent center</CardTitle>
            <CardDescription>
              Gate analytics or 3rd-party features until the user opts in.
            </CardDescription>
          </div>
          <Badge variant={allGranted ? "default" : "outline"} className="gap-1">
            {allGranted ? (
              <>
                <ShieldCheck size={14} /> All enabled
              </>
            ) : (
              <>
                <ShieldOff size={14} /> Partial
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.key}
              className="flex items-start justify-between gap-4 rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{feature.label}</p>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <Switch
                checked={allowed(feature.key)}
                onCheckedChange={(checked) => request(feature.key, checked)}
                aria-label={`Toggle ${feature.label}`}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button size="sm" onClick={enableAll}>
            Allow everything
          </Button>
          <Button size="sm" variant="secondary" onClick={revokeAll}>
            Revoke all
          </Button>
        </CardFooter>
      </Card>

      <div className="rounded-md border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Allowed features</p>
        {allowedFeatures.length ? (
          <p className="text-muted-foreground">{allowedFeatures.join(", ")}</p>
        ) : (
          <p className="text-muted-foreground">Nothing granted yet.</p>
        )}
      </div>
    </div>
  )
}
