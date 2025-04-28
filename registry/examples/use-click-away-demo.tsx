import * as React from "react"
import { X } from "lucide-react"
import * as ReactDOM from "react-dom"

import { Button } from "@/components/ui/button"
import { useClickAway } from "registry/hooks/use-click-away"

export default function UseClickAwayDemo() {
  const [isOpen, setIsOpen] = React.useState(false)
  const modalRef = useClickAway<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div>
        <Button className="link" onClick={handleOpenModal}>
          Open Modal
        </Button>
      </div>
      {isOpen &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm md:z-[998]" />
            <div
              ref={modalRef}
              className="fixed left-1/2 top-1/2 z-[999] grid h-60 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-4 text-muted-foreground shadow-md md:w-full"
            >
              <div className="relative flex h-full items-center justify-center">
                <X
                  size={18}
                  className="absolute right-1 top-1 cursor-pointer"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                />
                <p className="text-balance text-center">
                  Click outside the modal to close (or use the button) whatever
                  you prefer.
                </p>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
