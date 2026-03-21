import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDependencyGraph } from "../../registry/hooks/use-dependency-graph"

describe("useDependencyGraph", () => {
  it("registers nodes and edges and exposes inspector metrics", async () => {
    const { result } = renderHook(() =>
      useDependencyGraph({ componentName: "Widget", filePath: "/widget.tsx" })
    )

    await waitFor(() =>
      expect(result.current.getInspectorOutput().metrics.totalNodes).toBe(1)
    )

    act(() => {
      result.current.registerHook("useData")
      result.current.registerStore("auth-store")
      result.current.registerDependency("ThemeContext", "context", "consumes")
    })

    const output = result.current.getInspectorOutput()

    expect(output.metrics.totalNodes).toBeGreaterThanOrEqual(4)
    expect(output.metrics.totalEdges).toBeGreaterThanOrEqual(3)
    expect(output.metrics.hooks).toBeGreaterThanOrEqual(1)
    expect(output.metrics.stores).toBeGreaterThanOrEqual(1)
    expect(output.metrics.contexts).toBeGreaterThanOrEqual(1)

    act(() => {
      result.current.clear()
    })
  })
})
