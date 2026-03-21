import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useDropZone } from "../../registry/hooks/use-dropzone"

function createDragEvent(type: string, file: File) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as DragEvent & {
    dataTransfer: {
      files: File[]
      items: Array<{ type: string }>
      dropEffect: string
    }
  }

  Object.defineProperty(event, "dataTransfer", {
    configurable: true,
    value: {
      files: [file],
      items: [{ type: file.type }],
      dropEffect: "none",
    },
  })

  return event
}

function Harness() {
  const ref = React.useRef<HTMLDivElement>(null)
  const { files, clearFiles, isOverDropZone } = useDropZone(ref, {
    dataTypes: ["text/plain"],
  })

  return (
    <div>
      <div ref={ref} data-testid="zone" />
      <button onClick={clearFiles} type="button">
        clear
      </button>
      <output data-testid="state">
        {JSON.stringify({
          isOverDropZone,
          count: files?.length ?? 0,
          name: files?.[0]?.name ?? null,
        })}
      </output>
    </div>
  )
}

describe("useDropZone", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("tracks drag state, stores dropped files, and clears them", () => {
    render(<Harness />)

    const zone = screen.getByTestId("zone")
    const file = new File(["hello"], "note.txt", { type: "text/plain" })

    fireEvent(zone, createDragEvent("dragenter", file))
    expect(screen.getByTestId("state").textContent).toContain(
      '"isOverDropZone":true'
    )

    fireEvent(zone, createDragEvent("drop", file))
    expect(screen.getByTestId("state").textContent).toContain('"count":1')
    expect(screen.getByTestId("state").textContent).toContain(
      '"name":"note.txt"'
    )

    fireEvent.click(screen.getByRole("button", { name: "clear" }))
    expect(screen.getByTestId("state").textContent).toContain('"count":0')
    expect(screen.getByTestId("state").textContent).toContain('"name":null')
  })
})
