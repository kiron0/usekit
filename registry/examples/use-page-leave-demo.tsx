import React from "react"
import { usePageLeave } from "registry/hooks/use-page-leave"

export default function PageLeaveTracker() {
  const [distractions, setDistractions] = React.useState(0)

  usePageLeave(() => {
    setDistractions((d) => d + 1)
  })

  return (
    <div className="space-y-6 text-center">
      <p>(Mouse out of the page)</p>
      <h3 className="text-xl">
        You&apos;ve been distracted {distractions}{" "}
        {distractions === 1 ? "time" : "times"}.
      </h3>
    </div>
  )
}
