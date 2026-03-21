import * as React from "react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useSmartPlaceholder } from "../../registry/hooks/use-smart-placeholder"

function Harness() {
  const { render: renderPlaceholder } = useSmartPlaceholder("text", {
    lines: 2,
    seed: 42,
    animation: "none",
  })

  return <div data-testid="placeholder">{renderPlaceholder()}</div>
}

describe("useSmartPlaceholder", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }))
    )
  })

  it("renders the configured number of skeleton lines", () => {
    render(<Harness />)

    const container = screen.getByTestId("placeholder")

    expect(container.children).toHaveLength(2)
    expect((container.children[0] as HTMLElement).style.width).not.toBe("")
  })
})
