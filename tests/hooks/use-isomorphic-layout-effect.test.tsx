import * as React from "react"
import { describe, expect, it } from "vitest"

import { useIsomorphicLayoutEffect } from "../../registry/hooks/use-isomorphic-layout-effect"

describe("useIsomorphicLayoutEffect", () => {
  it("uses layout effect in the browser environment", () => {
    expect(useIsomorphicLayoutEffect).toBe(React.useLayoutEffect)
  })
})
