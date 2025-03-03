"use client"

import * as React from "react"

export function useDocumentTitle(title: string) {
  const initial = React.useRef(document.title)

  React.useEffect(() => {
    const initialTitle = initial.current
    document.title = title

    return () => {
      document.title = initialTitle
    }
  }, [title])
}
