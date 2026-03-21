import * as React from "react"
import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useAutosizeTextArea } from "../../registry/hooks/use-autosize-textarea"

describe("useAutosizeTextArea", () => {
  it("sizes the textarea to its scroll height within the provided bounds", () => {
    const textarea = document.createElement("textarea")
    const ref = {
      current: textarea,
    } as React.RefObject<HTMLTextAreaElement | null>

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 120,
    })

    const { rerender } = renderHook(
      ({ value }) =>
        useAutosizeTextArea({
          ref,
          maxHeight: 140,
          borderWidth: 2,
          dependencies: [value],
        }),
      {
        initialProps: { value: "a" },
      }
    )

    expect(textarea.style.height).toBe("124px")

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 200,
    })

    rerender({ value: "updated" })

    expect(textarea.style.height).toBe("144px")
  })
})
