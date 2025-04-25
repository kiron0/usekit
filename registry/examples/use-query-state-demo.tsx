"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useQueryState } from "registry/hooks/use-query-state"

export default function UseQueryStateDemo() {
  const [currentSearch, setCurrentSearch] = React.useState(
    typeof window !== "undefined" ? window.location.search : ""
  )

  React.useEffect(() => {
    const handler = () => setCurrentSearch(window.location.search)
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  function updateAndSync<T extends object>(fn: (args: T) => void) {
    return (args: T) => {
      fn(args)
      setTimeout(() => setCurrentSearch(window.location.search), 0)
    }
  }

  const { values: basicValues, setState: setBasicState } = useQueryState(
    ["search", "page"],
    {
      defaults: { page: "1" },
    }
  )

  const setBasicStateSync = updateAndSync(setBasicState)

  const {
    values: validatedValues,
    errors: validationErrors,
    setState: setValidatedState,
  } = useQueryState(["limit", "sort"], {
    defaults: { limit: "10", sort: "newest" },
    validators: {
      limit: (val) => {
        const num = parseInt(val)
        return num >= 5 && num <= 50 ? val : null
      },
      sort: (val) => {
        return ["newest", "oldest", "popular"].includes(val)
          ? (val as "newest" | "oldest" | "popular")
          : null
      },
    },
  })

  const setValidatedStateSync = updateAndSync(setValidatedState)

  const {
    values: suspenseValues,
    isPending,
    setState: setSuspenseState,
  } = useQueryState(["view"], { suspense: true })

  const setSuspenseStateSync = updateAndSync(setSuspenseState)

  const { batchUpdate } = useQueryState(["category", "priceMin", "priceMax"])

  const batchUpdateSync = updateAndSync(batchUpdate)

  const applyFilters = React.useCallback(() => {
    batchUpdateSync({
      category: "electronics",
      priceMin: "100",
      priceMax: "500",
    })
  }, [batchUpdateSync])

  return (
    <div className="w-full space-y-8">
      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-bold">1. Basic Usage</h2>
        <div className="space-y-2">
          <p>Current search: {basicValues.search || "None"}</p>
          <p>Current page: {basicValues.page}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => setBasicStateSync({ search: "react hooks" })}
            >
              Set Search
            </Button>
            <Button
              onClick={() =>
                setBasicStateSync({
                  page: String(Number(basicValues.page) + 1),
                })
              }
            >
              Next Page
            </Button>
            {basicValues.search && (
              <Button
                variant="secondary"
                onClick={() => setBasicStateSync({ search: null })}
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-bold">2. With Validation</h2>
        <div className="space-y-2">
          <p>Current limit: {validatedValues.limit}</p>
          {validationErrors.limit && (
            <p className="text-red-500">Error: {validationErrors.limit}</p>
          )}
          <p>Current sort: {validatedValues.sort}</p>
          {validationErrors.sort && (
            <p className="text-red-500">Error: {validationErrors.sort}</p>
          )}
          <div className="flex gap-2">
            <Button onClick={() => setValidatedStateSync({ limit: "5" })}>
              Set Valid Limit
            </Button>
            <Button onClick={() => setValidatedStateSync({ limit: "100" })}>
              Set Invalid Limit
            </Button>
            <Button onClick={() => setValidatedStateSync({ sort: "oldest" })}>
              Set Valid Sort
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-bold">3. With Suspense</h2>
        <div className="space-y-2">
          <p>Current view: {suspenseValues.view || "default"}</p>
          <p>Loading state: {isPending ? "Pending..." : "Ready"}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => setSuspenseStateSync({ view: "list" })}
              disabled={isPending}
            >
              Set List View
            </Button>
            <Button
              onClick={() => setSuspenseStateSync({ view: "grid" })}
              disabled={isPending}
            >
              Set Grid View
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-bold">4. Batch Updates</h2>
        <div className="space-y-2">
          <Button onClick={applyFilters}>Apply Complex Filters</Button>
          <p className="text-sm text-muted-foreground">
            (Check URL after click to see multiple params updated at once)
          </p>
        </div>
      </section>

      {typeof window !== "undefined" && currentSearch && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-4 text-xl font-bold">Current URL State</h2>
          <pre className="overflow-x-auto rounded-lg border p-4 text-sm">
            {currentSearch}
          </pre>
        </section>
      )}

      {typeof window !== "undefined" && currentSearch && (
        <Button
          variant="destructive"
          onClick={() => {
            window.history.replaceState({}, "", window.location.pathname)
            setCurrentSearch("")
          }}
        >
          Clear All Query Params
        </Button>
      )}
    </div>
  )
}
