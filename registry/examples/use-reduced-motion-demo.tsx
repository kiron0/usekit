"use client"

import { Accessibility, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useReducedMotion } from "registry/hooks/use-reduced-motion"

export default function UseReducedMotionDemo() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Reduced Motion
            </CardTitle>
            <CardDescription>
              Adapt animation-heavy interfaces when the user asks for less
              motion at the operating-system level.
            </CardDescription>
          </div>
          <Badge
            variant={prefersReducedMotion ? "outline" : "default"}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {prefersReducedMotion ? "Motion reduced" : "Full motion allowed"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Use this signal to disable autoplay motion, shorten transitions,
              or switch to instant state changes for comfort-sensitive users.
            </p>
          </div>

          <div
            className={
              prefersReducedMotion
                ? "rounded-lg border p-4"
                : "rounded-lg border p-4 transition-transform duration-700 hover:-translate-y-1"
            }
          >
            <p className="font-medium">Preview card</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The hover lift stays still when reduced motion is enabled.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
