import { generateLoremIpsum } from "@/utils/generate-lorem-ipsum"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("generateLoremIpsum", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("capitalizes the sentence and ends it with a period", () => {
    vi.spyOn(Math, "random").mockReturnValue(0)

    expect(generateLoremIpsum(3, 3)).toBe("Lorem, lorem, lorem.")
  })

  it("respects the requested max word count", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999)

    const sentence = generateLoremIpsum(3, 5)
    const words = sentence.trim().split(/\s+/)

    expect(words).toHaveLength(5)
    expect(sentence[0]).toMatch(/[A-Z]/)
    expect(sentence.endsWith(".")).toBe(true)
  })

  it("always returns a word count within the provided bounds", () => {
    for (let index = 0; index < 25; index += 1) {
      const sentence = generateLoremIpsum(4, 6)
      const words = sentence.trim().split(/\s+/)

      expect(words.length).toBeGreaterThanOrEqual(4)
      expect(words.length).toBeLessThanOrEqual(6)
    }
  })
})
