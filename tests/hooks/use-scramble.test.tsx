import * as React from "react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useScramble } from "../../registry/hooks/use-scramble"

function Harness() {
  const { ref } = useScramble({
    text: "READY",
    playOnMount: false,
  })

  return <div data-testid="scramble" ref={ref} />
}

describe("useScramble", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    )
  })

  it("renders the final text immediately when playOnMount is disabled", () => {
    render(<Harness />)

    expect(screen.getByTestId("scramble").textContent).toBe("READY")
  })
})
