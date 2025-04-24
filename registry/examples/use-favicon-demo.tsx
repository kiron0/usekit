"use client"

import * as React from "react"
import { favicons } from "@/utils"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFavicon } from "registry/hooks/use-favicon"

export default function UseFaviconDemo() {
  const [favicon, setFavicon] = React.useState(favicons[0].url)

  useFavicon(favicon)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {favicons.map(({ name, url, alt, title }) => (
          <Button
            key={name}
            title={title}
            className={cn("size-12 p-1")}
            variant={favicon === url ? "secondary" : "outline"}
            onClick={() => setFavicon(url)}
          >
            <img
              src={url}
              alt={alt}
              width={32}
              height={32}
              onContextMenu={(e) => e.preventDefault()}
              className="select-none"
            />
          </Button>
        ))}
      </div>
      <p className="text-balance text-center text-muted-foreground">
        Click on the buttons above to change the favicon of this page. The
        favicon will be updated in the browser tab.
      </p>
    </div>
  )
}
