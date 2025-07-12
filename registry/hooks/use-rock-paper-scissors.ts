import * as React from "react"

type Choice = "rock" | "paper" | "scissors"
type Result = "win" | "lose" | "draw" | null

const choices: Choice[] = ["rock", "paper", "scissors"]

const getRandomChoice = (): Choice =>
  choices[Math.floor(Math.random() * choices.length)]

const getResult = (player: Choice, computer: Choice): Result => {
  if (player === computer) return "draw"
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win"
  }
  return "lose"
}

export function useRockPaperScissors() {
  const [playerChoice, setPlayerChoice] = React.useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = React.useState<Choice | null>(
    null
  )
  const [result, setResult] = React.useState<Result>(null)
  const [score, setScore] = React.useState({ wins: 0, losses: 0, draws: 0 })

  const play = React.useCallback((choice: Choice) => {
    const computer = getRandomChoice()
    const outcome = getResult(choice, computer)

    setPlayerChoice(choice)
    setComputerChoice(computer)
    setResult(outcome)

    setScore((prev) => ({
      wins: prev.wins + (outcome === "win" ? 1 : 0),
      losses: prev.losses + (outcome === "lose" ? 1 : 0),
      draws: prev.draws + (outcome === "draw" ? 1 : 0),
    }))
  }, [])

  const reset = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setScore({ wins: 0, losses: 0, draws: 0 })
  }

  return {
    playerChoice,
    computerChoice,
    result,
    score,
    play,
    reset,
  }
}
