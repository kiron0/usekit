"use client"

import * as React from "react"
import Link from "next/link"

import { allDocs } from "@/contentlayer/generated"

export function HooksList() {
  const hooks = React.useMemo(() => {
    return allDocs
      .filter((doc) => doc.title.startsWith("use"))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((doc) => ({
        id: doc._id,
        title: doc.title,
        description: doc.description,
        slug: doc.slugAsParams,
      }))
  }, [])

  return (
    <div className="space-y-4">
      {hooks.map((doc, i) => (
        <div key={doc.id}>
          <Link href={`/docs/${doc.slug}`}>
            <p className="font-semibold">
              {i + 1}. {doc.title}
            </p>
            <p className="text-sm text-muted-foreground">{doc.description}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}
