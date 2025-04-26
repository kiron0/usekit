"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { TableOfContents } from "@/lib/toc"
import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import { Contribute } from "@/components/contribute"
import { DocGridPattern } from "@/components/doc-grid-pattern"
import { Loading } from "@/components/loading"
import { Mdx } from "@/components/mdx-components"
import { DocsPager } from "@/components/pager"
import { ScrambleText } from "@/components/scramble-text"
import { ScrollToTop } from "@/components/scroll-to-top"
import { DashboardTableOfContents } from "@/components/toc"
import { Doc } from "@/contentlayer/generated/types"

interface DocsDetailsProps {
  doc: Doc
  toc: TableOfContents
}

export function DocsDetails({ doc, toc }: DocsDetailsProps) {
  return (
    <React.Suspense fallback={<Loading />}>
      <DocGridPattern />
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0 max-w-3xl">
          <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
            <div className="truncate">Docs</div>
            <ChevronRightIcon className="size-3.5" />
            <div className="text-foreground">{doc.title}</div>
          </div>
          <div className="space-y-2">
            <ScrambleText
              text={doc.title}
              className={cn(
                "h-10 w-fit scroll-m-20 text-3xl font-bold tracking-tight"
              )}
            />
            {doc.description && (
              <p className="text-base text-muted-foreground">
                <Balancer>{doc.description}</Balancer>
              </p>
            )}
          </div>
          {doc.links ? (
            <div className="flex items-center space-x-2 pt-4">
              {Object.entries(doc.links).map(([k, v]) => (
                <Link
                  key={k}
                  href={v as any}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    badgeVariants({ variant: "secondary" }),
                    "gap-1"
                  )}
                >
                  {k}
                  <ExternalLinkIcon className="size-3" />
                </Link>
              ))}
            </div>
          ) : null}
          <div className="pb-12 pt-8">
            <Mdx code={doc.body.code} />
          </div>
          <DocsPager doc={doc} />
        </div>
        <div className="hidden text-sm xl:block">
          <div className="sticky top-20 -mt-6 h-[calc(100vh-3.5rem)] pt-4">
            <div className="no-scrollbar h-full space-y-4 overflow-auto pb-10">
              {doc.toc && <DashboardTableOfContents toc={toc} />}
              <Contribute slug={doc.slug} />
            </div>
          </div>
        </div>
        <ScrollToTop />
      </main>
    </React.Suspense>
  )
}
