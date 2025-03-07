"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFavicon } from "registry/hooks/use-favicon"

const favicons = [
  {
    name: "Toufiq Hasan Kiron",
    url: "https://toufiqhasankiron.com/favicon.ico",
    alt: "Toufiq Hasan Kiron logo",
    title: "Set the favicon to Toufiq Hasan Kiron's logo",
  },
  {
    name: "Next.js",
    url: "https://nextjs.org/favicon.ico",
    alt: "Next.js logo",
    title: "Set the favicon to Next.js's logo",
  },
  {
    name: "React",
    url: "https://react.dev/favicon.ico",
    alt: "React logo",
    title: "Set the favicon to React's logo",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/favicon.ico",
    alt: "Tailwind CSS logo",
    title: "Set the favicon to Tailwind CSS's logo",
  },
]

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
            className={cn("p-1 size-12")}
            variant={favicon === url ? "secondary" : "outline"}
            onClick={() => setFavicon(url)}
          >
            <Image
              src={url}
              alt={alt}
              width={32}
              height={32}
              quality={100}
              placeholder="blur"
              blurDataURL={url}
              onContextMenu={(e) => e.preventDefault()}
              className="select-none"
            />
          </Button>
        ))}
      </div>
      <p className="text-center text-muted-foreground text-balance">
        Click on the buttons above to change the favicon of this page. The
        favicon will be updated in the browser tab.
      </p>
    </div>
  )
}
