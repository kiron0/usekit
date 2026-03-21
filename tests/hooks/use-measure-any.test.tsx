import * as React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMeasureAny } from "../../registry/hooks/use-measure-any"

function createMatchMedia() {
  return vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

function Harness() {
  const { measurements, MeasureComponent, reset } = useMeasureAny({
    startMeasure: true,
  })

  return (
    <div>
      <MeasureComponent />
      <button onClick={reset} type="button">
        reset
      </button>
      <output data-testid="measure">
        {measurements
          ? `${measurements.width.px}x${measurements.height.px}`
          : "none"}
      </output>
    </div>
  )
}

describe("useMeasureAny", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", createMatchMedia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("measures a dragged area and can reset it", () => {
    render(<Harness />)

    act(() => {
      fireEvent.mouseDown(document, { clientX: 10, clientY: 20 })
    })

    act(() => {
      fireEvent.mouseMove(document, { clientX: 70, clientY: 120 })
      fireEvent.mouseUp(document)
    })

    expect(screen.getByTestId("measure").textContent).toBe("60x100")

    fireEvent.click(screen.getByRole("button", { name: "reset" }))
    expect(screen.getByTestId("measure").textContent).toBe("none")
  })
})
