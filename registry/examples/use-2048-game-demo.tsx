"use client"

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RefreshCw,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { use2048Game } from "registry/hooks/use-2048-game"

function tileTone(value: number) {
  if (value >= 128) return "bg-emerald-500 text-white"
  if (value >= 32) return "bg-amber-400 text-black"
  if (value >= 8) return "bg-orange-300 text-black"
  if (value >= 2) return "bg-stone-200 text-black"
  return "bg-muted text-muted-foreground"
}

export default function Use2048GameDemo() {
  const { board, score, bestTile, hasWon, isGameOver, move, resetGame } =
    use2048Game()

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>2048 Game</CardTitle>
            <CardDescription>
              Manage grid merges, score, and win/loss state for 2048-style
              puzzle interfaces without writing board math in the component.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Score {score}</Badge>
            <Badge variant="outline">Best {bestTile}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-2 rounded-xl bg-muted p-2">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-2">
                {row.map((cell, cellIndex) => (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={`flex aspect-square items-center justify-center rounded-lg text-lg font-bold ${tileTone(cell)}`}
                  >
                    {cell || ""}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => move("up")}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => move("left")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => move("down")}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => move("right")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button type="button" onClick={resetGame}>
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {hasWon && (
            <p className="text-sm font-medium text-emerald-600">
              Target reached.
            </p>
          )}
          {isGameOver && !hasWon && (
            <p className="text-sm font-medium text-destructive">
              No moves left.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
