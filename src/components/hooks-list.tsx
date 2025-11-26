"use client"

import * as React from "react"
import Link from "next/link"
import { env } from "@/env"
import { ArrowUpRight } from "lucide-react"

import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { CopyButton } from "@/components/copy-button"
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

  const [query, setQuery] = React.useState("")

  const filteredHooks = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return hooks

    return hooks.filter((hook) => {
      const haystack = `${hook.title} ${hook.description ?? ""} ${
        hook.label ?? ""
      }`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [hooks, query])

  const isDevelopment = env.NEXT_PUBLIC_NODE_ENV === "development"

  const copyValue = React.useMemo(() => {
    if (!isDevelopment) return ""
    const payload = filteredHooks.map((hook) => ({
      title: hook.title,
      description: hook.description ?? "",
    }))
    return JSON.stringify(payload, null, 2)
  }, [filteredHooks, isDevelopment])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-inner shadow-black/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Hooks directory
          </p>
          <p className="text-sm text-muted-foreground">
            {query.trim() === ""
              ? `${hooks.length} hooks available`
              : `${filteredHooks.length} matches out of ${hooks.length} hooks`}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, label, or description..."
              className="h-10 w-full rounded-xl text-sm transition"
              type="text"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 mr-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                clear
              </button>
            )}
          </div>
          {isDevelopment && (
            <CopyButton
              variant="outline"
              value={copyValue}
              className="h-10 w-full rounded-xl sm:w-10 [&>svg]:size-4"
              aria-label="Copy hook titles and descriptions"
              title="Copy hook titles and descriptions"
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredHooks.map((doc, i) => (
          <Link
            key={doc.id}
            href={`/docs/${doc.slug}`}
            className="group relative block h-full rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <span className="text-foreground">{i + 1}</span>
                <span>hook</span>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-primary" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {doc.title}
                </h3>
                {doc.label && (
                  <span
                    className={cn(
                      "rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-medium uppercase leading-none text-primary-foreground",
                      doc.label.toLowerCase() === "soon" &&
                        "bg-[#adfa1d] text-[#000000]"
                    )}
                  >
                    {doc.label}
                  </span>
                )}
              </div>
              {doc.description && (
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {doc.description?.slice(0, 60)}...
                </p>
              )}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <span>Read docs</span>
              <div className="h-px flex-1 bg-border/80" />
            </div>
          </Link>
        ))}
        {!filteredHooks.length && (
          <div className="col-span-full rounded-2xl border border-dashed border-border/70 bg-background/70 p-8 text-center text-sm text-muted-foreground">
            Nothing found. Try a different keyword.
          </div>
        )}
      </div>
    </div>
  )
}
