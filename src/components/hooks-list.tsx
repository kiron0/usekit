"use client"

import Link from "next/link"
import { allDocs } from "contentlayer/generated"

export function HooksList() {
  return (
    <div className="space-y-4">
      {allDocs
        .filter((doc) => doc.title.startsWith("use"))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((doc, i) => (
          <div key={doc.slug}>
            <Link href={`/docs/${doc.slugAsParams}`}>
              <p className="font-semibold">
                {i + 1}. {doc.title}
              </p>
              <p className="text-muted-foreground text-sm">{doc.description}</p>
            </Link>
          </div>
        ))}
    </div>
  )
}
