"use client"

import * as React from "react"
import { Hand, HandMetal, Scissors } from "lucide-react"

import { useConfetti } from "@/hooks/use-confetti"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRockPaperScissors } from "registry/hooks/use-rock-paper-scissors"

const icons = {
  rock: <HandMetal className="inline align-middle" />,
  paper: <Hand className="inline align-middle" />,
  scissors: <Scissors className="inline align-middle" />,
}

export default function UseRockPaperScissorsDemo() {
  const { playerChoice, computerChoice, result, score, play, reset } =
    useRockPaperScissors()

  const [showResult, setShowResult] = React.useState(false)
  const [confettiTrigger, setConfettiTrigger] = React.useState(false)

  useConfetti(confettiTrigger, 200)

  const handlePlay = (choice: "rock" | "paper" | "scissors") => {
    play(choice)
    setShowResult(true)
  }

  const resetGame = () => {
    reset()
    setShowResult(false)
  }

  const resultColor =
    result === "win"
      ? "text-green-600"
      : result === "lose"
        ? "text-red-600"
        : "text-yellow-600"

  React.useEffect(() => {
    if (result === "win") {
      setConfettiTrigger(true)
      setTimeout(() => setConfettiTrigger(false), 2000)
    }
  }, [result])

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold">Rock Paper Scissors</h2>
        <p className="text-sm text-muted-foreground">
          Choose your weapon. First to win 3 rounds!
        </p>
      </div>

      <div className="flex gap-3">
        {(["rock", "paper", "scissors"] as const).map((choice) => (
          <Button
            key={choice}
            onClick={() => handlePlay(choice)}
            className="size-14 text-2xl [&_svg]:size-9"
            disabled={showResult}
          >
            {icons[choice]}
          </Button>
        ))}
      </div>

      {showResult && (
        <Card className="w-full text-center">
          <CardContent className="space-y-3 p-6">
            <div className="text-lg">
              You: <span>{icons[playerChoice ?? "rock"]}</span>
            </div>
            <div className="text-lg">
              Computer: <span>{icons[computerChoice ?? "rock"]}</span>
            </div>
            <div className={`text-xl font-semibold ${resultColor}`}>
              {result === "win"
                ? "You Win!"
                : result === "lose"
                  ? "You Lose!"
                  : "It's a Draw!"}
            </div>
            <Button variant="secondary" onClick={() => setShowResult(false)}>
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <Badge variant="outline">Wins: {score.wins}</Badge>
          <Badge variant="outline">Losses: {score.losses}</Badge>
          <Badge variant="outline">Draws: {score.draws}</Badge>
        </div>
      </div>

      {score.wins + score.losses + score.draws > 0 && (
        <Button onClick={resetGame} variant="destructive" className="mt-2">
          Reset Game
        </Button>
      )}
    </div>
  )
}
