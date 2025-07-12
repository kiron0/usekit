"use client"

import * as React from "react"

import { useConfetti } from "@/hooks/use-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTicTacToe } from "registry/hooks/use-tic-tac-toe"

export default function UseTicTacToeDemo() {
  const [playerNames, setPlayerNames] = React.useState({ X: "", O: "" })
  const [namesLocked, setNamesLocked] = React.useState(false)
  const [confettiTrigger, setConfettiTrigger] = React.useState(false)

  useConfetti(confettiTrigger, 200)

  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    gameOver,
    makeMove,
    resetGame,
    playerNames: resolvedNames,
  } = useTicTacToe(namesLocked ? playerNames : undefined)

  const renderStatus = () => {
    if (winner) return `🎉 ${resolvedNames[winner]} wins!`
    if (isDraw) return "🤝 It's a draw!"
    return `🕹️ ${resolvedNames[currentPlayer]}'s turn`
  }

  React.useEffect(() => {
    if (gameOver && winner) {
      setConfettiTrigger(true)
      setTimeout(() => setConfettiTrigger(false), 2000)
    }
  }, [gameOver, winner])

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 md:py-10">
      <div className="space-y-6">
        <h1 className="text-center text-3xl font-extrabold tracking-tight">
          Tic Tac Toe
        </h1>

        {!namesLocked && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            <div className="space-y-1 text-center">
              <Label htmlFor="player-x">Player X</Label>
              <Input
                id="player-x"
                type="text"
                placeholder="Player X"
                value={playerNames.X}
                onChange={(e) =>
                  !namesLocked &&
                  setPlayerNames((names) => ({
                    ...names,
                    X: e.target.value,
                  }))
                }
                className="text-center"
                disabled={namesLocked}
              />
            </div>
            <div className="space-y-1 text-center">
              <Label htmlFor="player-o">Player O</Label>
              <Input
                id="player-o"
                type="text"
                placeholder="Player O"
                value={playerNames.O}
                onChange={(e) =>
                  !namesLocked &&
                  setPlayerNames((names) => ({
                    ...names,
                    O: e.target.value,
                  }))
                }
                className="text-center"
                disabled={namesLocked}
              />
            </div>
            <Button
              onClick={() => setNamesLocked(true)}
              className="md:mt-7"
              disabled={namesLocked}
            >
              Start Game
            </Button>
          </div>
        )}

        <p className="text-center text-base font-medium text-muted-foreground">
          {renderStatus()}
        </p>

        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, idx) => (
            <Button
              key={idx}
              onClick={() => makeMove(idx)}
              disabled={!!cell || gameOver || !namesLocked}
              variant="outline"
              className="h-20 w-full text-3xl font-bold sm:h-28"
            >
              {cell}
            </Button>
          ))}
        </div>

        {gameOver && (
          <div className="flex justify-center">
            <Button
              onClick={() => {
                resetGame()
                setNamesLocked(false)
              }}
              variant="destructive"
              className="mt-4"
            >
              🔁 Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
