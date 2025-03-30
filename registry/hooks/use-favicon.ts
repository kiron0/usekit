import * as React from "react"

export function useFavicon(url: string) {
  const originalHref = React.useRef<string | null>(null)
  const isLinkCreated = React.useRef(false)
  const linkRef = React.useRef<HTMLLinkElement | null>(null)

  React.useEffect(() => {
    if (!url || typeof url !== "string") {
      console.warn("useFavicon: Invalid favicon URL provided.")
      return
    }

    if (linkRef.current?.href === url) {
      return
    }

    const img = new Image()
    img.src = url

    const handleLoad = () => {
      const existingLink =
        document.querySelector<HTMLLinkElement>('link[rel="icon"]')

      if (existingLink) {
        if (originalHref.current === null) {
          originalHref.current = existingLink.href
        }
        linkRef.current = existingLink
      } else {
        const newLink = document.createElement("link")
        newLink.rel = "icon"
        newLink.type = getImageType(url)
        newLink.href = url
        document.head.appendChild(newLink)
        linkRef.current = newLink
        isLinkCreated.current = true
      }

      if (linkRef.current) {
        linkRef.current.href = url
      }
    }

    const handleError = () => {
      console.error(`useFavicon: Failed to load favicon from ${url}`)
    }

    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)

    return () => {
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }
  }, [url])

  React.useEffect(() => {
    return () => {
      const link = linkRef.current
      if (!link) return

      if (isLinkCreated.current) {
        link.parentNode?.removeChild(link)
      } else if (originalHref.current) {
        link.href = originalHref.current
      }
    }
  }, [])
}

function getImageType(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "ico":
      return "image/x-icon"
    case "png":
      return "image/png"
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "gif":
      return "image/gif"
    default:
      return "image/x-icon"
  }
}
