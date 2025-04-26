import * as React from "react"

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomChar(range: RangeOrCharCodes) {
  let rand = 0
  if (range.length === 2) {
    rand = getRandomInt(range[0], range[1])
  } else {
    rand = range[getRandomInt(0, range.length - 1)]
  }
  return String.fromCodePoint(rand)
}

type RangeOrCharCodes = { 0: number; 1: number } & number[]

export interface UseScrambleProps {
  playOnMount?: boolean
  text?: string
  speed?: number
  tick?: number
  step?: number
  chance?: number
  seed?: number
  scramble?: number
  ignore?: string[]
  range?: RangeOrCharCodes
  overdrive?: boolean | number
  overflow?: boolean
  onAnimationStart?: () => void
  onAnimationEnd?: () => void
  onAnimationFrame?: (result: string) => void
}

/* eslint-disable prefer-const */
export function useScramble(props: UseScrambleProps) {
  let {
    playOnMount = true,
    text = "",
    speed = 1,
    seed = 1,
    step = 1,
    tick = 1,
    scramble = 1,
    chance = 1,
    overflow = true,
    range = [65, 125],
    overdrive = true,
    onAnimationStart,
    onAnimationFrame,
    onAnimationEnd,
    ignore = [" "],
  } = props

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  if (prefersReducedMotion) {
    step = text.length
    chance = 0
    overdrive = false
  }

  const nodeRef = React.useRef<any>(null)
  const rafRef = React.useRef<number>(0)
  const elapsedRef = React.useRef(0)
  const fpsInterval = 1000 / (60 * speed)
  const stepRef = React.useRef<number>(0)
  const scrambleIndexRef = React.useRef<number>(0)
  const controlRef = React.useRef<Array<string | number | null>>([])
  const overdriveRef = React.useRef<number>(0)

  const setIfNotIgnored = (
    value: string | number | null,
    replace: string | number | null
  ) => (ignore.includes(`${value}`) ? value : replace)

  const seedForward = () => {
    if (scrambleIndexRef.current === text.length) return
    for (let i = 0; i < seed; i++) {
      const index = getRandomInt(
        scrambleIndexRef.current,
        controlRef.current.length
      )
      if (
        typeof controlRef.current[index] !== "number" &&
        typeof controlRef.current[index] !== "undefined"
      ) {
        controlRef.current[index] = setIfNotIgnored(
          controlRef.current[index],
          getRandomInt(0, 10) >= (1 - chance) * 10 ? scramble || seed : 0
        )
      }
    }
  }

  const stepForward = () => {
    for (let i = 0; i < step; i++) {
      if (scrambleIndexRef.current < text.length) {
        const currentIndex = scrambleIndexRef.current
        const shouldScramble = getRandomInt(0, 10) >= (1 - chance) * 10
        controlRef.current[currentIndex] = setIfNotIgnored(
          text[scrambleIndexRef.current],
          shouldScramble
            ? scramble + getRandomInt(0, Math.ceil(scramble / 2))
            : 0
        )
        scrambleIndexRef.current++
      }
    }
  }

  const resizeControl = () => {
    if (text.length < controlRef.current.length) {
      controlRef.current.pop()
      controlRef.current.splice(text.length, step)
    }
    for (let i = 0; i < step; i++) {
      if (controlRef.current.length < text.length) {
        controlRef.current.push(
          setIfNotIgnored(text[controlRef.current.length + 1], null)
        )
      }
    }
  }

  const onOverdrive = () => {
    if (!overdrive) return
    for (let i = 0; i < step; i++) {
      const max = Math.max(controlRef.current.length, text.length)
      if (overdriveRef.current < max) {
        controlRef.current[overdriveRef.current] = setIfNotIgnored(
          text[overdriveRef.current],
          String.fromCharCode(typeof overdrive === "boolean" ? 95 : overdrive)
        )
        overdriveRef.current++
      }
    }
  }

  const onTick = () => {
    stepForward()
    resizeControl()
    seedForward()
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  const animate = (time: number) => {
    if (!speed) return
    rafRef.current = requestAnimationFrame(animate)
    onOverdrive()
    const timeElapsed = time - elapsedRef.current
    if (timeElapsed > fpsInterval) {
      elapsedRef.current = time
      if (stepRef.current % tick === 0) {
        onTick()
      }
      draw()
    }
  }

  const draw = () => {
    if (!nodeRef.current) return
    let result = ""
    for (let i = 0; i < controlRef.current.length; i++) {
      const controlValue = controlRef.current[i]
      switch (true) {
        case typeof controlValue === "number" && controlValue > 0:
          result += getRandomChar(range)
          if (i <= scrambleIndexRef.current) {
            controlRef.current[i] = (controlRef.current[i] as number) - 1
          }
          break
        case typeof controlValue === "string" &&
          (i >= text.length || i >= scrambleIndexRef.current):
          result += controlValue
          break
        case controlValue === text[i] && i < scrambleIndexRef.current:
          result += text[i]
          break
        case controlValue === 0 && i < text.length:
          result += text[i]
          controlRef.current[i] = text[i]
          break
        default:
          result += ""
      }
    }
    nodeRef.current.innerHTML = result
    if (onAnimationFrame) {
      onAnimationFrame(result)
    }
    if (result === text) {
      controlRef.current.splice(text.length, controlRef.current.length)
      if (onAnimationEnd) {
        onAnimationEnd()
      }
      cancelAnimationFrame(rafRef.current)
    }
    stepRef.current++
  }

  const reset = () => {
    stepRef.current = 0
    scrambleIndexRef.current = 0
    overdriveRef.current = 0
    if (!overflow) {
      controlRef.current = new Array(text.length)
    }
  }

  const play = () => {
    cancelAnimationFrame(rafRef.current)
    reset()
    if (onAnimationStart) {
      onAnimationStart()
    }
    rafRef.current = requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    reset()
  }, [text])

  React.useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  React.useEffect(() => {
    if (!playOnMount) {
      controlRef.current = text.split("")
      stepRef.current = text.length
      scrambleIndexRef.current = text.length
      overdriveRef.current = text.length
      draw()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { ref: nodeRef, replay: play }
}
