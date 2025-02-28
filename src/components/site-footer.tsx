import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-grid border-t md:px-8">
      <div className="container-wrapper">
        <div className="container py-3">
          <div className="text-balance text-center text-xs leading-loose text-muted-foreground md:text-left">
            Built with ❤️ by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.author.name}
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  )
}
