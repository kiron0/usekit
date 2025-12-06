import Link from "next/link"

import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-3 md:px-8">
      <div className="container text-balance text-center text-xs leading-loose text-muted-foreground md:text-left">
        Built with{" "}
        <Link
          href="/docs/cli"
          className="font-medium underline underline-offset-4"
        >
          uselab
        </Link>{" "}
        by{" "}
        <Link
          href={siteConfig.links.portfolio}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          {siteConfig.author.name}
        </Link>
        .
      </div>
    </footer>
  )
}
