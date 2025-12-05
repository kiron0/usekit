"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBreadcrumbs } from "registry/hooks/use-breadcrumbs"

export default function UseBreadcrumbsDemo() {
  const [customLabel, setCustomLabel] = React.useState("")
  const [customHref, setCustomHref] = React.useState("")

  const { items, push, pop, replace, setItems, reset } = useBreadcrumbs({
    autoGenerate: true,
  })

  const handlePush = () => {
    if (customLabel && customHref) {
      push({ label: customLabel, href: customHref })
      setCustomLabel("")
      setCustomHref("")
    }
  }

  const handleReplace = () => {
    if (customLabel && customHref && items.length > 0) {
      replace({ label: customLabel, href: customHref })
      setCustomLabel("")
      setCustomHref("")
    }
  }

  const handleSetItems = () => {
    setItems([
      { label: "Home", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/dashboard/settings" },
      { label: "Profile", href: "/dashboard/settings/profile" },
    ])
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="p-0">
          <CardTitle>Breadcrumbs Navigation</CardTitle>
          <CardDescription>
            Manage breadcrumb navigation with push, pop, replace operations and
            auto-generation from URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="rounded-lg border bg-muted/50 p-4">
            <Label className="mb-2 block text-sm font-medium">
              Current Breadcrumbs
            </Label>
            <nav className="flex flex-wrap items-center gap-1 text-sm">
              {items.map((item, index) => {
                const isLast = index === items.length - 1
                return (
                  <React.Fragment key={`${item.href}-${index}`}>
                    {isLast ? (
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                    ) : (
                      <>
                        <Link
                          href={item.href}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                        <span className="text-muted-foreground">/</span>
                      </>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Total items: {items.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="e.g., Products"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="href">Href</Label>
              <Input
                id="href"
                placeholder="e.g., /products"
                value={customHref}
                onChange={(e) => setCustomHref(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePush}
              disabled={!customLabel || !customHref}
            >
              Push
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={pop}
              disabled={items.length <= 1}
            >
              Pop
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReplace}
              disabled={!customLabel || !customHref || items.length === 0}
            >
              Replace Last
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSetItems}
            >
              Set Custom Items
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              Reset
            </Button>
          </div>

          <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
            <Label className="text-sm font-medium">
              Breadcrumb Items (JSON)
            </Label>
            <pre className="overflow-auto rounded-md bg-background p-3 text-xs">
              {JSON.stringify(items, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
