import * as React from "react"

interface MemoryCard {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

interface ShuffleFunction {
  <T>(arr: T[]): T[]
}

export function useMemoryGame(values: string[]) {
  const [cards, setCards] = React.useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = React.useState<MemoryCard[]>([])
  const [isLocked, setIsLocked] = React.useState(false)
  const [matches, setMatches] = React.useState(0)
  const [isStarted, setIsStarted] = React.useState(false)

  const shuffle: ShuffleFunction = (arr) =>
    [...arr].sort(() => Math.random() - 0.5)

  const initializeGame = React.useCallback(() => {
    const doubled = values.flatMap((value) => [
      { id: Math.random(), value, isFlipped: false, isMatched: false },
      { id: Math.random(), value, isFlipped: false, isMatched: false },
    ])
    setCards(shuffle(doubled))
    setFlippedCards([])
    setMatches(0)
    setIsLocked(false)
    setIsStarted(true)
  }, [values])

  const flipCard = (cardId: number) => {
    if (isLocked || !isStarted) return

    const selected = cards.find((card) => card.id === cardId)
    if (!selected || selected.isFlipped || selected.isMatched) return

    const updated = cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    )
    setCards(updated)

    const newFlipped = [...flippedCards, { ...selected, isFlipped: true }]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setIsLocked(true)
      setTimeout(() => {
        const [first, second] = newFlipped
        if (first.value === second.value) {
          setCards((prev) =>
            prev.map((card) =>
              card.value === first.value ? { ...card, isMatched: true } : card
            )
          )
          setMatches((prev) => prev + 1)
        } else {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, isFlipped: false }
                : card
            )
          )
        }
        setFlippedCards([])
        setIsLocked(false)
      }, 800)
    }
  }

  const startGame = () => initializeGame()

  const resetGame = () => {
    setCards([])
    setFlippedCards([])
    setIsLocked(false)
    setMatches(0)
    setIsStarted(false)
  }

  const isGameComplete = matches === values.length

  return {
    cards,
    flipCard,
    startGame,
    resetGame,
    isGameComplete,
    matches,
    totalPairs: values.length,
    isStarted,
  }
}
