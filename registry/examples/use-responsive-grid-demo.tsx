"use client"

import * as React from "react"
import { LayoutGrid } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  useResponsiveGrid,
  type ResponsiveGridLayout,
} from "registry/hooks/use-responsive-grid"

const photos = [
  {
    id: 1,
    title: "Sunset Boulevard",
    description: "Golden hour across the bay",
    height: 220,
    tag: "Nature",
  },
  {
    id: 2,
    title: "Mountain Steps",
    description: "Switchbacks leading to the summit",
    height: 280,
    tag: "Adventure",
  },
  {
    id: 3,
    title: "Urban Lights",
    description: "Neon reflections after rain",
    height: 240,
    tag: "City",
  },
  {
    id: 4,
    title: "Coffee Ritual",
    description: "Pour-over morning routine",
    height: 200,
    tag: "Lifestyle",
  },
  {
    id: 5,
    title: "Desert Horizon",
    description: "Minimal dunes at dusk",
    height: 260,
    tag: "Travel",
  },
  {
    id: 6,
    title: "Glass Facade",
    description: "Patterns in modern architecture",
    height: 230,
    tag: "Design",
  },
]

const breakpointPresets = {
  gallery: [
    { minWidth: 0, columns: 1 },
    { minWidth: 640, columns: 2 },
    { minWidth: 900, columns: 3 },
    { minWidth: 1200, columns: 4 },
  ],
  dashboard: [
    { minWidth: 0, columns: 1 },
    { minWidth: 768, columns: 2 },
    { minWidth: 1024, columns: 3 },
  ],
  wide: [
    { minWidth: 0, columns: 1 },
    { minWidth: 720, columns: 3 },
    { minWidth: 1100, columns: 4 },
    { minWidth: 1400, columns: 5 },
  ],
} as const

type PresetKey = keyof typeof breakpointPresets

export default function UseResponsiveGridDemo() {
  const [preset, setPreset] = React.useState<PresetKey>("gallery")
  const [gap, setGap] = React.useState(20)
  const [defaultColumns, setDefaultColumns] = React.useState(1)
  const [layout, setLayout] = React.useState<ResponsiveGridLayout>("flex")

  const activeBreakpoints = React.useMemo(
    () => breakpointPresets[preset].map((bp) => ({ ...bp })),
    [preset]
  )

  const { columns, itemStyle, containerStyle } = useResponsiveGrid({
    breakpoints: activeBreakpoints,
    gap,
    defaultColumns,
    layout,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Playground</CardTitle>
          <CardDescription>
            Experiment with gap, default columns and breakpoint presets to see
            how the hook responds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Breakpoint Preset</Label>
              <Select
                value={preset}
                onValueChange={(value) => setPreset(value as PresetKey)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallery">
                    Gallery (1 → 4 columns)
                  </SelectItem>
                  <SelectItem value="dashboard">
                    Dashboard (1 → 3 columns)
                  </SelectItem>
                  <SelectItem value="wide">Wide (1 → 5 columns)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Columns (SSR / narrow widths)</Label>
              <Select
                value={defaultColumns.toString()}
                onValueChange={(value) => setDefaultColumns(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 column</SelectItem>
                  <SelectItem value="2">2 columns</SelectItem>
                  <SelectItem value="3">3 columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Layout Mode</Label>
              <Select
                value={layout}
                onValueChange={(value) =>
                  setLayout(value as ResponsiveGridLayout)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex">Flex Grid</SelectItem>
                  <SelectItem value="masonry">Masonry Columns</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Masonry uses CSS columns (`break-inside: avoid`) to achieve true
                staggered heights.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col items-center justify-between gap-1 text-sm sm:flex-row">
              <Label htmlFor="gap-slider">Gap: {gap}px</Label>
              <span className="text-center text-xs text-muted-foreground sm:text-left">
                Drag to simulate dense vs roomy layouts
              </span>
            </div>
            <Slider
              id="gap-slider"
              min={8}
              max={40}
              step={2}
              value={[gap]}
              onValueChange={([nextGap]) => setGap(nextGap)}
            />
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Active breakpoints</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {activeBreakpoints.map((bp) => (
                <li key={bp.minWidth}>
                  ≥ {bp.minWidth}px → {bp.columns} column
                  {bp.columns > 1 ? "s" : ""}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Responsive Grid</CardTitle>
            <CardDescription>
              Layout adapts from 1 to 4 columns depending on viewport width.
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
            <Badge variant="secondary">
              {columns} {layout === "masonry" ? "Column(s)" : "Flex columns"}
            </Badge>
            <span className="text-muted-foreground">Gap: {gap}px</span>
          </div>
        </CardHeader>
        <CardContent>
          <div style={containerStyle}>
            {photos.map((photo) => (
              <article
                key={photo.id}
                className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm"
                style={{
                  ...itemStyle,
                  height: photo.height,
                }}
              >
                <div className="flex flex-1 flex-col gap-4 p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                      {photo.tag}
                    </div>
                    <span className="text-xs uppercase tracking-wide opacity-80">
                      #{photo.id}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">{photo.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {photo.description}
                    </p>
                  </div>
                  <div className="mt-auto text-xs text-muted-foreground">
                    Item width: {itemStyle.width}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
