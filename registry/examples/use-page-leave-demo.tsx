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
        className="space-y-2 text-center border-2 p-6 rounded-xl w-96 mx-auto duration-300 hover:border-dashed hover:cursor-pointer hover:border-primary"
      >
        <p>(Mouse out of the box)</p>
        <h1 className="text-2xl font-semibold py-4">
          {distractions}{" "}
          {distractions === 0 ? "time" : distractions > 1 ? "times" : "time"}
        </h1>
        <p>You&apos;ve been distracted</p>
      </div>
    </div>
  )
}
