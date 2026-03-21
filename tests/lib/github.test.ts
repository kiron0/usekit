import { describe, expect, it } from "vitest"

import { getGithubFileUrl, getGitHubIssueUrl } from "@/lib/github"

describe("getGitHubIssueUrl", () => {
  it("builds a GitHub issue URL with encoded query parameters", () => {
    const issueUrl = getGitHubIssueUrl({
      title: "Bug report",
      body: "Steps to reproduce & expected result",
      labels: ["bug", "good first issue"],
      template: "bug_report.md",
    })
    const parsedUrl = new URL(issueUrl)

    expect(`${parsedUrl.origin}${parsedUrl.pathname}`).toBe(
      "https://github.com/kiron0/usekit/issues/new"
    )
    expect(parsedUrl.searchParams.get("title")).toBe("Bug report")
    expect(parsedUrl.searchParams.get("body")).toBe(
      "Steps to reproduce & expected result"
    )
    expect(parsedUrl.searchParams.get("template")).toBe("bug_report.md")
    expect(parsedUrl.searchParams.getAll("labels")).toEqual([
      "bug",
      "good first issue",
    ])
  })
})

describe("getGithubFileUrl", () => {
  it("resolves the docs index route to the index MDX file", () => {
    expect(getGithubFileUrl("/docs")).toBe(
      "https://github.com/kiron0/usekit/blob/main/content/docs/index.mdx"
    )
  })

  it("maps nested docs slugs to MDX files", () => {
    expect(getGithubFileUrl("/docs/hooks/use-counter")).toBe(
      "https://github.com/kiron0/usekit/blob/main/content/docs/hooks/use-counter.mdx"
    )
  })
})
