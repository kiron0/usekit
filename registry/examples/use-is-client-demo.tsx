import { useIsClient } from "registry/hooks/use-is-client"

export default function UseIsClientDemo() {
  const isClient = useIsClient()

  return (
    <div className="space-y-2 text-center">
      <h2 className="text-xl font-semibold">Is Client? </h2>
      <p>{isClient ? "If you can see this ... you already know" : "No"}</p>
    </div>
  )
}
