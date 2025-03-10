import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-3 md:px-8">
      <div className="container text-balance text-center text-xs leading-loose text-muted-foreground md:text-left">
        Built by{" "}
        <a
          href={siteConfig.links.twitter}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          {siteConfig.author.name}
        </a>
        . Inspired by{" "}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          shadcn
        </a>
        .
      </div>
    </footer>
  )
}
