"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSnakeGame } from "registry/hooks/use-snake-game"

const Cell = ({ isSnake, isFood }: { isSnake: boolean; isFood: boolean }) => (
  <div
    className={cn(
      "size-4",
      isSnake
        ? "rounded bg-green-600"
        : isFood
          ? "rounded bg-red-600"
          : "bg-transparent"
    )}
  />
)

export default function UseSnakeGameDemo() {
  const {
    snake,
    food,
    isGameOver,
    score,
    resetGame,
    gridSize,
    isRunning,
    startGame,
  } = useSnakeGame()

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="text-lg font-bold">Score: {score}</div>
      <div
        className="grid w-full rounded-xl border bg-transparent p-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize
          const y = Math.floor(index / gridSize)
          const isSnake = snake.some((s) => s.x === x && s.y === y)
          const isFood = food.x === x && food.y === y
          return <Cell key={index} isSnake={isSnake} isFood={isFood} />
        })}
      </div>

      {!isRunning && !isGameOver && (
        <Button onClick={startGame}>Start Game</Button>
      )}
      {isGameOver && (
        <>
          <p className="font-bold text-destructive">Game Over</p>
          <Button variant="destructive" onClick={resetGame}>
            Restart Game
          </Button>
        </>
      )}
    </div>
  )
}
