import * as React from "react"
import confetti, { Options } from "canvas-confetti"

export function useConfetti(trigger: boolean, count = 200) {
  const defaults = React.useMemo<Options>(
    () => ({
      origin: { y: 0.7 },
    }),
    []
  )

  const fire = React.useCallback(
    (particleRatio: number, opts: Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    },
    [count, defaults]
  )

  React.useEffect(() => {
    if (trigger) {
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2, { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1, { spread: 120, startVelocity: 45 })
    }
  }, [fire, trigger])
}
