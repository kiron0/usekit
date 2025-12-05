"use client"

import * as React from "react"

import { docsConfig } from "@/config/docs"
import { allDocs } from "@/contentlayer/generated"

import { HookCard } from "./hooks-list"

export function ChangelogNewHooks() {
  const allDocsMap = React.useMemo(() => {
    return new Map(allDocs.map((doc) => [doc.title, doc]))
  }, [])

  const newHooks = React.useMemo(() => {
    const hooksGroup = docsConfig.sidebarNav.find(
      (group) => group.title === "Hooks"
    )

    if (!hooksGroup?.items) return []

    return hooksGroup.items
      .filter((item) => item.label === "New" && item.title.startsWith("use"))
      .map((item) => {
        const doc = allDocsMap.get(item.title)

        return {
          id: doc?._id ?? item.href ?? item.title,
          title: item.title,
          description: doc?.description,
          label: item.label,
          href: item.href ?? `/docs/hooks/${item.title}`,
        }
      })
  }, [allDocsMap])

  if (!newHooks.length) return null

  return (
    <div className="mt-2 w-full space-y-6">
      <h2 className="text-lg font-semibold md:text-xl">
        New Hooks ({newHooks.length})
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {newHooks.map((hook, index) => (
          <HookCard
            key={hook.id}
            id={hook.id}
            index={index + 1}
            title={hook.title}
            description={hook.description}
            label={hook.label}
            href={hook.href}
          />
        ))}
      </div>
    </div>
  )
}
