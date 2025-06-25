"use client"

import * as React from "react"
import Link from "next/link"

import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { allDocs } from "@/contentlayer/generated"

export function HooksList() {
  const docsConfigHooksMap = React.useMemo(() => {
    return new Map(
      docsConfig.sidebarNav
        .flatMap((item) => item.items || [])
        .filter((item) => item.title.startsWith("use"))
        .map((item) => [item.title, item.label])
    )
  }, [])

  const allDocsHooks = React.useMemo(() => {
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

  const hooks = React.useMemo(() => {
    return allDocsHooks.map((doc) => ({
      ...doc,
      label: docsConfigHooksMap.get(doc.title),
    }))
  }, [allDocsHooks, docsConfigHooksMap])

  return (
    <div className="space-y-4">
      {hooks.map((doc, i) => (
        <div key={doc.id}>
          <Link href={`/docs/${doc.slug}`}>
            <div className="flex items-center gap-2 font-semibold">
              {i + 1}. {doc.title}{" "}
              {doc.label && (
                <span
                  className={cn(
                    "rounded-md bg-primary px-1.5 py-0.5 text-xs font-normal leading-none text-primary-foreground no-underline group-hover:no-underline",
                    doc.label.toLowerCase() === "soon" &&
                      "bg-[#adfa1d] text-[#000000]"
                  )}
                >
                  {doc.label}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{doc.description}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}
