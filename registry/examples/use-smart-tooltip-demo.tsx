"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useSmartTooltip,
  type TooltipSide,
} from "registry/hooks/use-smart-tooltip"

function TooltipButton({
  label,
  className,
  prefersDirection,
  enableCollision,
}: {
  label: string
  className: string
  prefersDirection: TooltipSide
  enableCollision: boolean
}) {
  const { triggerRef, show, hide, Tooltip, position } = useSmartTooltip({
    prefersDirection,
    enableCollisionDetection: enableCollision,
    offset: 8,
    viewportPadding: 8,
    renderContent: (pos) => (
      <div className="whitespace-nowrap">
        {pos ? (
          <>
            {label} - {pos.side}
            {pos.flipped && " (flipped)"}
          </>
        ) : (
          "Calculating position..."
        )}
      </div>
    ),
  })

  return (
    <>
      <div className={className}>
        <Button
          ref={triggerRef as React.RefObject<HTMLButtonElement>}
          onMouseEnter={show}
          onMouseLeave={hide}
          variant="outline"
        >
          {label}
        </Button>
      </div>
      <Tooltip />
    </>
  )
}

export default function UseSmartTooltipDemo() {
  const [prefersDirection, setPrefersDirection] =
    React.useState<TooltipSide>("top")
  const [enableCollision, setEnableCollision] = React.useState(true)

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="p-0">
          <CardTitle>Smart Tooltip</CardTitle>
          <CardDescription>
            Tooltip that automatically adjusts position based on available space
            with collision detection and auto-flip.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="direction">Preferred Direction</Label>
              <Select
                value={prefersDirection}
                onValueChange={(value) =>
                  setPrefersDirection(value as TooltipSide)
                }
              >
                <SelectTrigger id="direction">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Collision Detection</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enable-collision"
                  checked={enableCollision}
                  onCheckedChange={(checked) =>
                    setEnableCollision(checked === true)
                  }
                />
                <Label htmlFor="enable-collision">Enable auto-flip</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <Label className="text-sm font-medium">Settings</Label>
            <p className="text-xs text-muted-foreground">
              Hover over any button to see the smart tooltip in action. Each
              button has its own tooltip instance that adjusts position based on
              available space.
            </p>
          </div>

          <div className="relative h-[400px] w-full overflow-hidden rounded-lg border bg-background">
            <div className="absolute inset-0 p-8">
              <div className="grid h-full grid-cols-3 gap-4">
                <TooltipButton
                  label="Top-Left"
                  className="flex items-start justify-start"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Top-Center"
                  className="flex items-start justify-center"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Top-Right"
                  className="flex items-start justify-end"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Middle-Left"
                  className="flex items-center justify-start"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Center"
                  className="flex items-center justify-center"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Middle-Right"
                  className="flex items-center justify-end"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Bottom-Left"
                  className="flex items-end justify-start"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Bottom-Center"
                  className="flex items-end justify-center"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
                <TooltipButton
                  label="Bottom-Right"
                  className="flex items-end justify-end"
                  prefersDirection={prefersDirection}
                  enableCollision={enableCollision}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
