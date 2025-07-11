import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { NavItem, NavItemWithChildren } from "@/types/nav"
import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Doc } from "@/contentlayer/generated"

interface DocsPagerProps {
  doc: Doc
  variant?: "default" | "secondary"
}

export function DocsPager({ doc, variant = "default" }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)

  if (!pager) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-between md:flex-nowrap",
        variant === "default" ? "gap-4" : "gap-2"
      )}
    >
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className={buttonVariants({
            size: variant === "default" ? "default" : "sm",
            variant: "secondary",
          })}
        >
          <ArrowLeft />
          {variant === "default" ? pager.prev.title : null}
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className={buttonVariants({
            size: variant === "default" ? "default" : "sm",
            variant: "secondary",
            className: "ml-auto",
          })}
        >
          {variant === "default" ? pager.next.title : null}
          <ArrowRight />
        </Link>
      )}
    </div>
  )
}

export function getPagerForDoc(doc: Doc) {
  const nav = docsConfig.sidebarNav
  const flattenedLinks = [null, ...flatten(nav), null]
  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.href
  )
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null
  return {
    prev,
    next,
  }
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(
        link.items?.length
          ? flatten(
              link.items
                .map((item) => ({ ...item }))
                .sort((a, b) => {
                  const aStartsWithUse = a.title.toLowerCase().startsWith("use")
                  const bStartsWithUse = b.title.toLowerCase().startsWith("use")

                  if (aStartsWithUse && bStartsWithUse) {
                    return a.title.localeCompare(b.title)
                  }

                  if (aStartsWithUse) return -1
                  if (bStartsWithUse) return 1
                  return 0
                })
            )
          : link
      )
    }, [])
    .filter((link) => !link?.disabled)
}
