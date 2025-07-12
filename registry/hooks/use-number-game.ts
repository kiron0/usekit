import * as React from "react"

interface Return {
  targetNumber: number
  guess: number | null
  message: string
  attempts: number
  gameOver: boolean
  hasWon: boolean
  hasLost: boolean
}

interface Options {
  maxAttempts?: number
  revealTarget?: boolean
  min?: number
  max?: number
}

const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

type History = { guess: number; label: string }

export function useNumberGame(options?: Options) {
  const initializeGame = React.useCallback(
    (): Return => ({
      targetNumber: generateRandomNumber(
        options?.min || 1,
        options?.max || 100
      ),
      guess: null,
      message: `Guess a number between ${options?.min || 1} and ${options?.max || 100}!`,
      attempts: 0,
      gameOver: false,
      hasWon: false,
      hasLost: false,
    }),
    [options?.min, options?.max]
  )

  const [gameState, setGameState] = React.useState<Return>(() =>
    initializeGame()
  )
  const [history, setHistory] = React.useState<History[]>([])

  React.useEffect(() => {
    setGameState(initializeGame())
    setHistory([])
  }, [initializeGame])

  const makeGuess = React.useCallback(
    (guess: number) => {
      let nextHistoryEntry: History

      setGameState((prev) => {
        if (prev.gameOver) return prev

        const attempts = prev.attempts + 1
        const isCorrect = guess === prev.targetNumber
        const hasExceededAttempts = attempts >= (options?.maxAttempts || 10)
        let message = ""
        let gameOver = false
        let hasWon = false
        let hasLost = false
        let label = ""

        if (isCorrect) {
          message = `🎉 Correct! You guessed it in ${attempts} attempt${attempts > 1 ? "s" : ""}.`
          gameOver = true
          hasWon = true
          label = "🎯 Correct"
        } else if (hasExceededAttempts) {
          message = `❌ Game Over! You've used all ${options?.maxAttempts || 10} attempts. The number was ${prev.targetNumber}.`
          gameOver = true
          hasLost = true
          label = guess < prev.targetNumber ? "🔽 Too Low" : "🔼 Too High"
        } else {
          message =
            guess < prev.targetNumber
              ? "🔽 Too low! Try a higher number."
              : "🔼 Too high! Try a lower number."
          label = guess < prev.targetNumber ? "🔽 Too Low" : "🔼 Too High"
        }

        nextHistoryEntry = { guess, label }

        return {
          ...prev,
          guess,
          attempts,
          message,
          gameOver,
          hasWon,
          hasLost,
        }
      })

      setHistory((prev) => [...prev, nextHistoryEntry!])
    },
    [options?.maxAttempts]
  )

  const resetGame = React.useCallback(() => {
    setGameState(initializeGame())
    setHistory([])
  }, [initializeGame])

  const { targetNumber: _, ...gameStateWithoutTarget } = gameState

  return {
    ...gameStateWithoutTarget,
    ...(options?.revealTarget && { targetNumber: gameState.targetNumber }),
    makeGuess,
    resetGame,
    history,
    maxAttempts: options?.maxAttempts || 10,
  }
}
