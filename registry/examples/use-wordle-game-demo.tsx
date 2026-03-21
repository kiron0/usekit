"use client"

import * as React from "react"
import { Delete, RefreshCw, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWordleGame } from "registry/hooks/use-wordle-game"

function tileClass(status?: "correct" | "present" | "absent") {
  if (status === "correct") return "border-emerald-500 bg-emerald-500/15"
  if (status === "present") return "border-amber-500 bg-amber-500/15"
  if (status === "absent") return "border-slate-500 bg-slate-500/10"
  return "border-border"
}

export default function UseWordleGameDemo() {
  const {
    currentGuess,
    guesses,
    error,
    isWin,
    isLose,
    attemptsLeft,
    setCurrentGuess,
    removeLetter,
    submitGuess,
    resetGame,
    wordLength,
  } = useWordleGame({
    words: ["REACT", "STACK", "LEVEL", "QUEUE", "STATE", "HOOKS"],
  })

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>Wordle Game</CardTitle>
            <CardDescription>
              Run a Wordle-style loop with duplicate-letter scoring, keyboard
              state, and turn tracking from a single hook.
            </CardDescription>
          </div>
          <Badge variant="outline">{attemptsLeft} attempts left</Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, rowIndex) => {
              const guess = guesses[rowIndex]
              const letters = guess
                ? guess.tiles
                : currentGuess
                    .padEnd(wordLength, " ")
                    .split("")
                    .map((letter) => ({ letter, status: undefined }))

              return (
                <div key={rowIndex} className="grid grid-cols-5 gap-2">
                  {letters.map((tile, columnIndex) => (
                    <div
                      key={`${rowIndex}-${columnIndex}`}
                      className={`flex h-12 items-center justify-center rounded-md border text-lg font-bold uppercase ${tileClass(tile.status)}`}
                    >
                      {tile.letter}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <Input
              value={currentGuess}
              onChange={(event) =>
                setCurrentGuess(
                  event.target.value.toUpperCase().slice(0, wordLength)
                )
              }
              maxLength={wordLength}
              placeholder={`Guess a ${wordLength}-letter word`}
              disabled={isWin || isLose}
            />
            <Button
              type="button"
              onClick={() => submitGuess()}
              disabled={isWin || isLose}
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
            <Button type="button" variant="outline" onClick={removeLetter}>
              <Delete className="h-4 w-4" />
              Backspace
            </Button>
            <Button type="button" variant="outline" onClick={resetGame}>
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {isWin && (
            <p className="text-sm font-medium text-emerald-600">Solved.</p>
          )}
          {isLose && (
            <p className="text-sm font-medium text-destructive">
              Out of turns.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
