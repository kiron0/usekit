"use client"

import { Button } from "@/components/ui/button"
import { useScramble } from "registry/hooks/use-scramble"

export default function UseScrambleDemo() {
  const { ref, replay } = useScramble({
    text: "Hello, World!",
    speed: 0.8,
    tick: 1,
    step: 1,
    scramble: 4,
    chance: 0.8,
    seed: 2,
    range: [65, 125],
    overdrive: true,
    overflow: true,
    onAnimationStart: () => console.log("Animation started!"),
    onAnimationEnd: () => console.log("Animation ended!"),
    onAnimationFrame: (result) => console.log(result),
  })

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 ref={ref} className="h-7 text-2xl font-bold md:h-10 md:text-4xl" />
      <Button onClick={replay}>Replay</Button>
      <p className="text-balance text-center text-muted-foreground">
        Click to replay the scramble animation! Check the console for animation
        events.
      </p>
    </div>
  )
}
