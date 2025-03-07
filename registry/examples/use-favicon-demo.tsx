"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useFavicon } from "registry/hooks/use-favicon"

export default function UseFaviconDemo() {
  const [favicon, setFavicon] = React.useState(
    "https://ui.dev/favicon/favicon-32x32.png"
  )

  useFavicon(favicon)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        title="Set the favicon to Bytes' logo"
        className="link"
        onClick={() =>
          setFavicon("https://bytes.dev/favicon/favicon-32x32.png")
        }
      >
        Bytes
      </Button>
      <Button
        title="Set the favicon to React Newsletter's logo"
        className="link"
        onClick={() =>
          setFavicon("https://reactnewsletter.com/favicon/favicon-32x32.png")
        }
      >
        React Newsletter
      </Button>

      <Button
        title="Set the favicon to uidotdev's logo"
        className="link"
        onClick={() => setFavicon("https://ui.dev/favicon/favicon-32x32.png")}
      >
        ui.dev
      </Button>
    </div>
  )
}
