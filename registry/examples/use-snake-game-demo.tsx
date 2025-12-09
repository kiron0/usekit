"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Difficulty, useSnakeGame } from "registry/hooks/use-snake-game"

const Cell = ({ isSnake, isFood }: { isSnake: boolean; isFood: boolean }) => (
  <div
    className={cn(
      "h-full w-full rounded-sm transition-colors",
      isSnake
        ? "bg-emerald-500 shadow-inner"
        : isFood
          ? "bg-amber-500 shadow-inner"
          : "bg-background"
    )}
  />
)

export default function UseSnakeGameDemo() {
  const [level, setLevel] = React.useState<Difficulty>(Difficulty.NORMAL)
  const {
    snake,
    food,
    isGameOver,
    score,
    resetGame,
    gridSize,
    isRunning,
    startGame,
    level: currentLevel,
  } = useSnakeGame(level)

  const handleLevelChange = (next: Difficulty) => {
    if (next === level) return
    setLevel(next)
    resetGame()
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-lg flex-col gap-2 rounded-lg border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Score</div>
          <div className="text-lg font-bold tabular-nums">{score}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Difficulty:
          </span>
          {Object.values(Difficulty).map((lvl) => (
            <Button
              key={lvl}
              size="sm"
              variant={currentLevel === lvl ? "default" : "outline"}
              onClick={() => handleLevelChange(lvl)}
              className="capitalize"
            >
              {lvl}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-3xl overflow-hidden rounded-xl border border-muted p-3 shadow-inner">
        <div
          className="grid h-full w-full gap-0"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
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
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Button size="lg" onClick={startGame}>
              Start
            </Button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
            <p className="text-lg font-bold text-destructive">Game Over</p>
            <Button size="lg" variant="destructive" onClick={resetGame}>
              Restart
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
