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
    <div>
      <h1>useIsFirstRender Example</h1>
      <p>
        {isFirstRender
          ? "This is the first render."
          : "This is a subsequent render."}
      </p>
    </div>
  )
}
