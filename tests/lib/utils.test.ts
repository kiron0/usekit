import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges conditional class names", () => {
    expect(cn("rounded-md", false && "hidden", "text-sm")).toBe(
      "rounded-md text-sm"
    )
  })

  it("prefers the later conflicting Tailwind class", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm")
  })
})
