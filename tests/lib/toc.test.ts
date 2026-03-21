import { describe, expect, it } from "vitest"

import { getTableOfContents } from "@/lib/toc"

describe("getTableOfContents", () => {
  it("builds a nested table of contents from markdown headings", async () => {
    const toc = await getTableOfContents(`
## Intro

### Deep Dive

## API
`)

    expect(toc).toEqual({
      items: [
        {
          title: "Intro",
          url: "#intro",
          items: [
            {
              title: "Deep Dive",
              url: "#deep-dive",
            },
          ],
        },
        {
          title: "API",
          url: "#api",
        },
      ],
    })
  })

  it("returns an empty object when no headings are present", async () => {
    await expect(
      getTableOfContents("Plain paragraph text only.")
    ).resolves.toEqual({})
  })
})
