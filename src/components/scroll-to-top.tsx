"use client"

import { MoveUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWindowScroll } from "registry/hooks/use-window-scroll"

export function ScrollToTop() {
  const [{ y }, scrollTo] = useWindowScroll()

  const scrollToTop = () => {
    scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!y) return null

  if (y < 300) return null

  return (
    <div className="fixed bottom-5 right-5 z-[999]">
      <Button variant="secondary" size="icon" onClick={scrollToTop}>
        <MoveUp size={24} />
      </Button>
    </div>
  )
}
