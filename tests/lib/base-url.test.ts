import { headers } from "next/headers"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getBaseURL } from "@/lib/baseUrl"
import { absoluteUrl } from "@/lib/utils"

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}))

const mockedHeaders = vi.mocked(headers)

describe("getBaseURL", () => {
  beforeEach(() => {
    mockedHeaders.mockReset()
  })

  it("uses http for localhost development requests", async () => {
    mockedHeaders.mockResolvedValue(
      new Headers({ host: "localhost:3000" }) as never
    )

    await expect(getBaseURL()).resolves.toBe("http://localhost:3000")
  })

  it("uses https for non-local hosts", async () => {
    mockedHeaders.mockResolvedValue(
      new Headers({ host: "usekit.kiron.dev" }) as never
    )

    await expect(getBaseURL()).resolves.toBe("https://usekit.kiron.dev")
  })
})

describe("absoluteUrl", () => {
  beforeEach(() => {
    mockedHeaders.mockReset()
  })

  it("builds an absolute URL from the current host", async () => {
    mockedHeaders.mockResolvedValue(
      new Headers({ host: "usekit.kiron.dev" }) as never
    )

    await expect(absoluteUrl("/docs/hooks")).resolves.toBe(
      "https://usekit.kiron.dev/docs/hooks"
    )
  })
})
