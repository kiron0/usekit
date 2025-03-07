import * as React from "react"

export function useFavicon(url: string) {
  const originalHref = React.useRef<string | null>(null)
  const isLinkCreated = React.useRef(false)
  const linkRef = React.useRef<HTMLLinkElement | null>(null)

  React.useEffect(() => {
    if (!url) {
      throw new Error("Invalid favicon URL: URL cannot be empty.")
    }

    const img = new Image()
    img.src = url

    img.onload = () => {
      const existingLink =
        document.querySelector<HTMLLinkElement>('link[rel~="icon"]')

      if (existingLink) {
        originalHref.current = existingLink.href
        linkRef.current = existingLink
      } else {
        const newLink = document.createElement("link")
        newLink.rel = "icon"
        newLink.type = "image/x-icon"
        newLink.href = url
        document.head.appendChild(newLink)
        linkRef.current = newLink
        isLinkCreated.current = true
      }
    }

    img.onerror = () => {
      throw new Error(`Invalid favicon URL: ${url} is not a valid image.`)
    }
  }, [url])

  React.useEffect(() => {
    if (linkRef.current) {
      linkRef.current.href = url
    }
  }, [url])

  React.useEffect(() => {
    return () => {
      if (!linkRef.current) return

      if (isLinkCreated.current) {
        document.head.removeChild(linkRef.current)
      } else if (originalHref.current) {
        linkRef.current.href = originalHref.current
      }
    }
  }, [])
}
