import * as React from "react"

import { useIsFirstRender } from "registry/hooks/use-is-first-render"

export default function UseIsFirstRenderDemo() {
  const isFirstRender = useIsFirstRender()

  React.useEffect(() => {
    if (!isFirstRender) {
      console.log("This effect runs on every render except the first one.")
    } else {
      console.log("This is the first render. Skipping effect.")
    }
  }, [isFirstRender])

  return (
    <div className="space-y-2 text-center">
      <h2 className="text-xl font-semibold">Is First Render?</h2>
      <p>
        {isFirstRender
          ? "Yes, This is the first render."
          : "No, This is a subsequent render."}
      </p>
    </div>
  )
}
