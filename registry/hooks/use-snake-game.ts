import * as React from "react"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

interface Position {
  x: number
  y: number
}

const GRID_SIZE = 20

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
})

export function useSnakeGame(speed: number = 150) {
  const [snake, setSnake] = React.useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = React.useState<Position>(getRandomPosition)
  const [direction, setDirection] = React.useState<Direction>("RIGHT")
  const [isGameOver, setIsGameOver] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)

  const directionRef = React.useRef(direction)
  directionRef.current = direction

  const moveSnake = React.useCallback(() => {
    if (isGameOver || !isRunning) return

    const head = { ...snake[0] }

    switch (directionRef.current) {
      case "UP":
        head.y -= 1
        break
      case "DOWN":
        head.y += 1
        break
      case "LEFT":
        head.x -= 1
        break
      case "RIGHT":
        head.x += 1
        break
    }

    const outOfBounds =
      head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE
    const hitsSelf = snake.some(
      (segment) => segment.x === head.x && segment.y === head.y
    )

    if (outOfBounds || hitsSelf) {
      setIsGameOver(true)
      setIsRunning(false)
      return
    }

    const newSnake = [head, ...snake]

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition())
      setScore((prev) => prev + 1)
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, food, isGameOver, isRunning])

  React.useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(moveSnake, speed)
    return () => clearInterval(interval)
  }, [moveSnake, speed, isRunning])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        e.preventDefault()
      }

      setDirection((prev) => {
        switch (key) {
          case "ArrowUp":
            return prev !== "DOWN" ? "UP" : prev
          case "ArrowDown":
            return prev !== "UP" ? "DOWN" : prev
          case "ArrowLeft":
            return prev !== "RIGHT" ? "LEFT" : prev
          case "ArrowRight":
            return prev !== "LEFT" ? "RIGHT" : prev
          default:
            return prev
        }
      })
    }

    window.addEventListener("keydown", handleKeyDown, { passive: false })
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(getRandomPosition())
    setDirection("RIGHT")
    setIsGameOver(false)
    setScore(0)
    setIsRunning(false)
  }

  const startGame = () => {
    if (!isGameOver) {
      setIsRunning(true)
    }
  }

  return {
    snake,
    food,
    isGameOver,
    isRunning,
    score,
    direction,
    startGame,
    resetGame,
    gridSize: GRID_SIZE,
  }
}
