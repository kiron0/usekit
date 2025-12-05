import * as React from "react"

export interface DependencyNode {
  id: string
  name: string
  type: "component" | "hook" | "store" | "context"
  filePath?: string
  lineNumber?: number
  metadata?: Record<string, unknown>
}

export interface DependencyEdge {
  from: string
  to: string
  type: "uses" | "provides" | "consumes" | "depends-on"
  weight?: number
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>
  edges: DependencyEdge[]
  timestamp: number
}

export interface InspectorOutput {
  graph: DependencyGraph
  metrics: {
    totalNodes: number
    totalEdges: number
    components: number
    hooks: number
    stores: number
    contexts: number
    maxDependencies: number
    minDependencies: number
    avgDependencies: number
    couplingScore: number
  }
  clusters: Array<{
    nodes: string[]
    type: "tightly-coupled" | "loosely-coupled" | "isolated"
    score: number
  }>
  recommendations: string[]
}

interface DependencyTracker {
  registerNode: (node: DependencyNode) => void
  registerEdge: (edge: DependencyEdge) => void
  getGraph: () => DependencyGraph
  getInspectorOutput: () => InspectorOutput
  clear: () => void
}

const dependencyStore = new Map<string, DependencyNode>()
const dependencyEdges: DependencyEdge[] = []
const componentRegistry = new Map<string, string>()
let edgeCounter = 0

function generateNodeId(name: string, type: DependencyNode["type"]): string {
  return `${type}:${name}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`
}

function createTracker(): DependencyTracker {
  return {
    registerNode: (node: DependencyNode) => {
      dependencyStore.set(node.id, node)
    },
    registerEdge: (edge: DependencyEdge) => {
      dependencyEdges.push({
        ...edge,
        weight: edge.weight ?? 1,
      })
      edgeCounter++
    },
    getGraph: (): DependencyGraph => {
      return {
        nodes: new Map(dependencyStore),
        edges: [...dependencyEdges],
        timestamp: Date.now(),
      }
    },
    getInspectorOutput: (): InspectorOutput => {
      const graph = {
        nodes: new Map(dependencyStore),
        edges: [...dependencyEdges],
        timestamp: Date.now(),
      }

      const nodes = Array.from(graph.nodes.values())
      const edges = graph.edges

      const components = nodes.filter((n) => n.type === "component").length
      const hooks = nodes.filter((n) => n.type === "hook").length
      const stores = nodes.filter((n) => n.type === "store").length
      const contexts = nodes.filter((n) => n.type === "context").length

      const dependencyCounts = nodes.map((node) => {
        return edges.filter((e) => e.from === node.id || e.to === node.id)
          .length
      })

      const maxDependencies = Math.max(...dependencyCounts, 0)
      const minDependencies = Math.min(...dependencyCounts, 0)
      const avgDependencies =
        dependencyCounts.length > 0
          ? dependencyCounts.reduce((a, b) => a + b, 0) /
            dependencyCounts.length
          : 0

      const maxPossibleEdges = nodes.length * (nodes.length - 1)
      const edgeDensity =
        maxPossibleEdges > 0 ? edges.length / maxPossibleEdges : 0
      const couplingScore = Math.min(
        1,
        (avgDependencies / Math.max(maxDependencies, 1)) * 0.6 +
          edgeDensity * 0.4
      )

      const clusters: InspectorOutput["clusters"] = []
      const visited = new Set<string>()

      nodes.forEach((node) => {
        if (visited.has(node.id)) return

        const clusterNodes: string[] = [node.id]
        visited.add(node.id)

        const findConnected = (nodeId: string) => {
          edges.forEach((edge) => {
            const connectedId =
              edge.from === nodeId
                ? edge.to
                : edge.to === nodeId
                  ? edge.from
                  : null
            if (connectedId && !visited.has(connectedId)) {
              visited.add(connectedId)
              clusterNodes.push(connectedId)
              findConnected(connectedId)
            }
          })
        }

        findConnected(node.id)

        if (clusterNodes.length > 1) {
          const clusterDeps = clusterNodes.reduce((acc, nid) => {
            return (
              acc + edges.filter((e) => e.from === nid || e.to === nid).length
            )
          }, 0)
          const clusterScore =
            clusterDeps / (clusterNodes.length * (clusterNodes.length - 1))

          clusters.push({
            nodes: clusterNodes,
            type:
              clusterScore > 0.5
                ? "tightly-coupled"
                : clusterScore > 0.2
                  ? "loosely-coupled"
                  : "isolated",
            score: clusterScore,
          })
        } else {
          clusters.push({
            nodes: clusterNodes,
            type: "isolated",
            score: 0,
          })
        }
      })

      const recommendations: string[] = []

      if (couplingScore > 0.7) {
        recommendations.push(
          "High coupling detected. Consider breaking down tightly coupled components into smaller, more focused modules."
        )
      }

      const tightlyCoupledClusters = clusters.filter(
        (c) => c.type === "tightly-coupled"
      )
      if (tightlyCoupledClusters.length > 0) {
        recommendations.push(
          `Found ${tightlyCoupledClusters.length} tightly coupled cluster(s). Consider introducing abstraction layers or dependency injection.`
        )
      }

      const isolatedNodes = clusters.filter(
        (c) => c.type === "isolated" && c.nodes.length === 1
      )
      if (isolatedNodes.length > nodes.length * 0.3) {
        recommendations.push(
          "Many isolated components detected. Consider consolidating related functionality."
        )
      }

      if (maxDependencies > 10) {
        recommendations.push(
          "Some components have excessive dependencies. Consider using composition patterns or context providers to reduce direct dependencies."
        )
      }

      if (hooks > components * 0.5) {
        recommendations.push(
          "High hook-to-component ratio detected. Consider creating custom hooks that combine multiple hooks to reduce coupling."
        )
      }

      return {
        graph,
        metrics: {
          totalNodes: nodes.length,
          totalEdges: edges.length,
          components,
          hooks,
          stores,
          contexts,
          maxDependencies,
          minDependencies,
          avgDependencies: Math.round(avgDependencies * 100) / 100,
          couplingScore: Math.round(couplingScore * 100) / 100,
        },
        clusters,
        recommendations,
      }
    },
    clear: () => {
      dependencyStore.clear()
      dependencyEdges.length = 0
      componentRegistry.clear()
      edgeCounter = 0
    },
  }
}

const globalTracker = createTracker()

export interface UseDependencyGraphOptions {
  componentName?: string
  filePath?: string
}

export interface UseDependencyGraphReturn {
  registerDependency: (
    targetName: string,
    targetType: DependencyNode["type"],
    edgeType?: DependencyEdge["type"]
  ) => void
  registerHook: (hookName: string, metadata?: Record<string, unknown>) => void
  registerStore: (storeName: string, metadata?: Record<string, unknown>) => void
  registerContext: (
    contextName: string,
    metadata?: Record<string, unknown>
  ) => void
  getGraph: () => DependencyGraph
  getInspectorOutput: () => InspectorOutput
  clear: () => void
  exportGraph: () => string
  downloadGraph: (filename?: string) => void
}

export function useDependencyGraph(
  options: UseDependencyGraphOptions = {}
): UseDependencyGraphReturn {
  const { componentName, filePath } = options

  const componentIdRef = React.useRef<string | null>(null)
  const registeredHooksRef = React.useRef<Set<string>>(new Set())

  const detectedName = React.useMemo(() => {
    if (componentName) return componentName

    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      try {
        const stack = new Error().stack
        if (stack) {
          const lines = stack.split("\n")
          const componentLine = lines.find(
            (line) =>
              line.includes("at ") &&
              !line.includes("useDependencyGraph") &&
              !line.includes("node_modules")
          )
          if (componentLine) {
            const match = componentLine.match(/at\s+(\w+)/)
            if (match) return match[1]
          }
        }
      } catch {}
    }

    return "UnknownComponent"
  }, [componentName])

  React.useEffect(() => {
    const componentId = generateNodeId(detectedName, "component")
    componentIdRef.current = componentId

    globalTracker.registerNode({
      id: componentId,
      name: detectedName,
      type: "component",
      filePath,
      metadata: {
        mountedAt: Date.now(),
      },
    })

    return () => {}
  }, [detectedName, filePath])

  const registerDependency = React.useCallback(
    (
      targetName: string,
      targetType: DependencyNode["type"],
      edgeType: DependencyEdge["type"] = "uses"
    ) => {
      if (!componentIdRef.current) return

      const targetId = generateNodeId(targetName, targetType)

      if (!dependencyStore.has(targetId)) {
        globalTracker.registerNode({
          id: targetId,
          name: targetName,
          type: targetType,
        })
      }

      globalTracker.registerEdge({
        from: componentIdRef.current,
        to: targetId,
        type: edgeType,
        weight: 1,
      })
    },
    []
  )

  const registerHook = React.useCallback(
    (hookName: string, metadata?: Record<string, unknown>) => {
      if (!componentIdRef.current) return

      const hookId = `hook:${hookName}`

      if (registeredHooksRef.current.has(hookId)) return
      registeredHooksRef.current.add(hookId)

      if (!dependencyStore.has(hookId)) {
        globalTracker.registerNode({
          id: hookId,
          name: hookName,
          type: "hook",
          metadata,
        })
      }

      globalTracker.registerEdge({
        from: componentIdRef.current,
        to: hookId,
        type: "uses",
        weight: 1,
      })
    },
    []
  )

  const registerStore = React.useCallback(
    (storeName: string, metadata?: Record<string, unknown>) => {
      if (!componentIdRef.current) return

      const storeId = `store:${storeName}`

      if (!dependencyStore.has(storeId)) {
        globalTracker.registerNode({
          id: storeId,
          name: storeName,
          type: "store",
          metadata,
        })
      }

      globalTracker.registerEdge({
        from: componentIdRef.current,
        to: storeId,
        type: "consumes",
        weight: 1,
      })
    },
    []
  )

  const registerContext = React.useCallback(
    (contextName: string, metadata?: Record<string, unknown>) => {
      if (!componentIdRef.current) return

      const contextId = `context:${contextName}`

      if (!dependencyStore.has(contextId)) {
        globalTracker.registerNode({
          id: contextId,
          name: contextName,
          type: "context",
          metadata,
        })
      }

      globalTracker.registerEdge({
        from: componentIdRef.current,
        to: contextId,
        type: "consumes",
        weight: 1,
      })
    },
    []
  )

  const getGraph = React.useCallback(() => {
    return globalTracker.getGraph()
  }, [])

  const getInspectorOutput = React.useCallback(() => {
    return globalTracker.getInspectorOutput()
  }, [])

  const clear = React.useCallback(() => {
    globalTracker.clear()
    registeredHooksRef.current.clear()
    componentIdRef.current = null
  }, [])

  const exportGraph = React.useCallback(() => {
    const output = globalTracker.getInspectorOutput()
    return JSON.stringify(
      {
        graph: {
          nodes: Array.from(output.graph.nodes.values()),
          edges: output.graph.edges,
          timestamp: output.graph.timestamp,
        },
        metrics: output.metrics,
        clusters: output.clusters,
        recommendations: output.recommendations,
      },
      null,
      2
    )
  }, [])

  const downloadGraph = React.useCallback(
    (filename?: string) => {
      if (typeof window === "undefined") {
        console.warn(
          "downloadGraph: Cannot download file in non-browser environment"
        )
        return
      }

      const json = exportGraph()
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename || `dependency-graph-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    [exportGraph]
  )

  return {
    registerDependency,
    registerHook,
    registerStore,
    registerContext,
    getGraph,
    getInspectorOutput,
    clear,
    exportGraph,
    downloadGraph,
  }
}
