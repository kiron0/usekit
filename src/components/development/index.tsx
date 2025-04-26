"use client"

import * as React from "react"

import { Component } from "@/components/development/component"
import { Icons } from "@/components/icons"
import { RerenderComponent } from "@/components/rerender-component"

export function Development() {
  const [key, setKey] = React.useState(0)

  const Preview = React.useMemo(() => {
    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component not found in registry.
        </p>
      )
    }

    return <Component />
  }, [])

  return (
    <div key={key} className="flex min-h-[350px] w-full justify-center">
      <div className="relative w-full rounded-md border pt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="absolute right-4 top-4 space-x-2">
          <RerenderComponent onClick={() => setKey((prev) => prev + 1)} />
        </div>
        <div className="flex h-full w-full items-center justify-center p-2 pt-6">
          <React.Suspense
            fallback={
              <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Loading...
              </div>
            }
          >
            {Preview}
          </React.Suspense>
        </div>
      </div>
    </div>
  )
}
