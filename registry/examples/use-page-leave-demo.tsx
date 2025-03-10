import * as React from "react"

import { usePageLeave } from "registry/hooks/use-page-leave"

export default function UsePageLeaveDemo() {
  const elementRef = React.useRef<HTMLDivElement>(null)
  const [distractions, setDistractions] = React.useState(0)

  usePageLeave(() => {
    setDistractions((d) => d + 1)
  }, elementRef)

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        ref={elementRef}
        className="mx-auto w-96 space-y-2 rounded-xl border-2 p-6 text-center duration-300 hover:cursor-pointer hover:border-dashed hover:border-primary"
      >
        <p>(Mouse out of the box)</p>
        <h1 className="py-4 text-2xl font-semibold">
          {distractions}{" "}
          {distractions === 0 ? "time" : distractions > 1 ? "times" : "time"}
        </h1>
        <p>You&apos;ve been distracted</p>
      </div>
    </div>
  )
}
