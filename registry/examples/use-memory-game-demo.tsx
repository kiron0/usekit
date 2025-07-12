"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMemoryGame } from "registry/hooks/use-memory-game"

const DEFAULT_SYMBOLS = ["🙂", "😌", "😍", "🥰", "😭", "😬"]

export default function UseMemoryGameDemo() {
  const [symbols, setSymbols] = React.useState<string[]>(DEFAULT_SYMBOLS)
  const [inputValue, setInputValue] = React.useState(symbols.join(" "))
  const {
    startGame,
    isStarted,
    cards,
    flipCard,
    resetGame,
    isGameComplete,
    matches,
  } = useMemoryGame(symbols)

  const handleSymbolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSetSymbols = () => {
    const arr = Array.from(
      new Set(inputValue.split(/\s+/).filter(Boolean))
    ).slice(0, 12)
    if (arr.length >= 2) {
      setSymbols(arr)
      startGame()
    }
  }

  const handleRestart = () => {
    resetGame()
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Memory Game</h1>
        <p className="text-sm text-muted-foreground">
          Match all pairs of cards to win!
        </p>
      </div>

      {!isStarted && (
        <div className="flex w-full flex-col items-center gap-2">
          <Label htmlFor="symbols-input">
            Symbols (space separated, 2-12):
          </Label>
          <Input
            id="symbols-input"
            type="text"
            value={inputValue}
            onChange={handleSymbolsChange}
            className="w-full text-center"
            maxLength={50}
          />
          <Button
            onClick={handleSetSymbols}
            disabled={
              isStarted ||
              inputValue.trim().split(/\s+/).filter(Boolean).length < 2
            }
          >
            Start Game
          </Button>
        </div>
      )}

      {isStarted && (
        <div className="text-lg font-semibold">
          Matches: {matches} / {symbols.length}
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <Button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className="size-20 text-2xl"
            variant={card.isFlipped || card.isMatched ? "default" : "outline"}
            disabled={card.isFlipped || card.isMatched || !isStarted}
          >
            {card.isFlipped || card.isMatched ? card.value : "❓"}
          </Button>
        ))}
      </div>
      {isGameComplete && (
        <div className="text-xl font-bold text-green-700">🎉 You won!</div>
      )}
      {isStarted && <Button onClick={handleRestart}>Restart</Button>}
    </div>
  )
}
