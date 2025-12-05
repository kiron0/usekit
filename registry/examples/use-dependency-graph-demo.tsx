"use client"

import * as React from "react"
import { Download, Network, RefreshCw, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDependencyGraph } from "registry/hooks/use-dependency-graph"

function useMockFetch() {
  React.useState()
  return { data: null, loading: false }
}

function useMockStore() {
  React.useState()
  return { value: 0 }
}

function useMockAuth() {
  React.useContext(React.createContext(null))
  return { user: null }
}

function UserProfile({
  graph,
}: {
  graph: ReturnType<typeof useDependencyGraph>
}) {
  const { registerHook, registerContext } = graph
  const auth = useMockAuth()
  const data = useMockFetch()

  React.useEffect(() => {
    registerHook("useFetch")
    registerContext("AuthContext")
  }, [registerHook, registerContext])

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">UserProfile</h3>
      <p className="text-sm text-muted-foreground">
        Uses: useFetch, AuthContext
      </p>
    </div>
  )
}

function ShoppingCart({
  graph,
}: {
  graph: ReturnType<typeof useDependencyGraph>
}) {
  const { registerHook, registerStore } = graph
  const store = useMockStore()
  const data = useMockFetch()

  React.useEffect(() => {
    registerHook("useFetch")
    registerStore("CartStore")
  }, [registerHook, registerStore])

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">ShoppingCart</h3>
      <p className="text-sm text-muted-foreground">Uses: useFetch, CartStore</p>
    </div>
  )
}

function Dashboard({
  graph,
}: {
  graph: ReturnType<typeof useDependencyGraph>
}) {
  const { registerHook, registerStore, registerContext } = graph
  const auth = useMockAuth()
  const store = useMockStore()
  const data1 = useMockFetch()
  const data2 = useMockFetch()

  React.useEffect(() => {
    registerHook("useFetch")
    registerStore("DashboardStore")
    registerContext("AuthContext")
  }, [registerHook, registerStore, registerContext])

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">Dashboard</h3>
      <p className="text-sm text-muted-foreground">
        Uses: useFetch (2x), DashboardStore, AuthContext
      </p>
    </div>
  )
}

export default function UseDependencyGraphDemo() {
  const graph = useDependencyGraph({ componentName: "DependencyGraphDemo" })
  const [inspectorOutput, setInspectorOutput] = React.useState<ReturnType<
    typeof graph.getInspectorOutput
  > | null>(null)
  const [showGraph, setShowGraph] = React.useState(false)

  const analyzeGraph = React.useCallback(() => {
    const output = graph.getInspectorOutput()
    setInspectorOutput(output)
    setShowGraph(true)
  }, [graph])

  const clearGraph = React.useCallback(() => {
    graph.clear()
    setInspectorOutput(null)
    setShowGraph(false)
  }, [graph])

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>Dependency Graph Inspector</CardTitle>
            <CardDescription>
              Track component dependencies and analyze architectural coupling in
              your application.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={analyzeGraph} variant="default">
              <Network className="h-4 w-4" />
              Analyze Graph
            </Button>
            {inspectorOutput && (
              <>
                <Button
                  type="button"
                  onClick={() => graph.downloadGraph()}
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button type="button" onClick={clearGraph} variant="ghost">
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <UserProfile graph={graph} />
            <ShoppingCart graph={graph} />
            <Dashboard graph={graph} />
          </div>

          {showGraph && inspectorOutput && (
            <div className="space-y-4 rounded-xl border border-dashed border-muted-foreground/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  Analysis Results
                </div>
                <Badge variant="secondary">
                  {inspectorOutput.metrics.totalNodes} nodes,{" "}
                  {inspectorOutput.metrics.totalEdges} edges
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Components
                  </div>
                  <div className="text-2xl font-bold">
                    {inspectorOutput.metrics.components}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Hooks</div>
                  <div className="text-2xl font-bold">
                    {inspectorOutput.metrics.hooks}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Stores</div>
                  <div className="text-2xl font-bold">
                    {inspectorOutput.metrics.stores}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Coupling Score
                  </div>
                  <div className="text-2xl font-bold">
                    {inspectorOutput.metrics.couplingScore}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Metrics</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Avg Dependencies:
                    </span>
                    <span className="font-medium">
                      {inspectorOutput.metrics.avgDependencies}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Max Dependencies:
                    </span>
                    <span className="font-medium">
                      {inspectorOutput.metrics.maxDependencies}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Min Dependencies:
                    </span>
                    <span className="font-medium">
                      {inspectorOutput.metrics.minDependencies}
                    </span>
                  </div>
                </div>
              </div>

              {inspectorOutput.clusters.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Clusters</h4>
                  <div className="space-y-2">
                    {inspectorOutput.clusters.map((cluster, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md border p-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              cluster.type === "tightly-coupled"
                                ? "destructive"
                                : cluster.type === "loosely-coupled"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {cluster.type}
                          </Badge>
                          <span className="text-muted-foreground">
                            {cluster.nodes.length} node(s)
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Score: {cluster.score.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inspectorOutput.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Recommendations</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {inspectorOutput.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!showGraph && (
            <div className="rounded-xl border border-dashed border-muted-foreground/40 p-8 text-center">
              <Network className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-sm text-muted-foreground">
                Click &quot;Analyze Graph&quot; to inspect component
                dependencies and coupling patterns.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
