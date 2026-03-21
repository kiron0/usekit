import * as React from "react"

type LetterStatus = "correct" | "present" | "absent"

interface EvaluatedTile {
  letter: string
  status: LetterStatus
}

interface GuessResult {
  guess: string
  tiles: EvaluatedTile[]
  isCorrect: boolean
}

interface KeyboardState {
  [key: string]: LetterStatus
}

interface UseWordleGameOptions {
  words?: string[]
  maxAttempts?: number
  answer?: string
  random?: () => number
}

const DEFAULT_WORDS = ["react", "hooks", "state", "stack", "level", "queue"]
const DEFAULT_DICTIONARY = buildDictionary(DEFAULT_WORDS)

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  absent: 0,
  present: 1,
  correct: 2,
}

function normalizeWord(word: string) {
  return word.trim().toUpperCase()
}

function buildDictionary(words: string[]) {
  const normalizedWords = words.map(normalizeWord).filter(Boolean)
  const wordLength = normalizedWords[0]?.length ?? 5

  return normalizedWords.filter((word) => word.length === wordLength)
}

function pickWord(words: string[], random: () => number, answer?: string) {
  if (answer) return normalizeWord(answer)

  const safeWords = words.length > 0 ? words : buildDictionary(DEFAULT_WORDS)
  const index = Math.min(
    safeWords.length - 1,
    Math.floor(random() * safeWords.length)
  )

  return safeWords[index]
}

function evaluateGuess(guess: string, answer: string): EvaluatedTile[] {
  const tiles = guess.split("").map((letter) => ({
    letter,
    status: "absent" as LetterStatus,
  }))
  const remaining = new Map<string, number>()

  for (let index = 0; index < answer.length; index += 1) {
    const answerLetter = answer[index]
    const guessLetter = guess[index]

    if (guessLetter === answerLetter) {
      tiles[index].status = "correct"
      continue
    }

    remaining.set(answerLetter, (remaining.get(answerLetter) ?? 0) + 1)
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (tiles[index].status === "correct") continue

    const guessLetter = guess[index]
    const count = remaining.get(guessLetter) ?? 0

    if (count > 0) {
      tiles[index].status = "present"
      remaining.set(guessLetter, count - 1)
    }
  }

  return tiles
}

function getKeyboardState(guesses: GuessResult[]) {
  const state: KeyboardState = {}

  for (const guess of guesses) {
    for (const tile of guess.tiles) {
      const previous = state[tile.letter]

      if (
        !previous ||
        STATUS_PRIORITY[tile.status] > STATUS_PRIORITY[previous]
      ) {
        state[tile.letter] = tile.status
      }
    }
  }

  return state
}

export function useWordleGame(options: UseWordleGameOptions = {}) {
  const {
    words = DEFAULT_WORDS,
    maxAttempts = 6,
    answer,
    random = Math.random,
  } = options

  const dictionary = React.useMemo(() => buildDictionary(words), [words])
  const fallbackDictionary =
    dictionary.length > 0 ? dictionary : DEFAULT_DICTIONARY
  const dictionaryKey = fallbackDictionary.join("|")
  const stableDictionary = React.useMemo(
    () => fallbackDictionary,
    [dictionaryKey, fallbackDictionary]
  )
  const normalizedAnswer = answer ? normalizeWord(answer) : undefined
  const wordLength = normalizedAnswer
    ? normalizedAnswer.length
    : (stableDictionary[0]?.length ?? 5)
  const allowedGuesses = React.useMemo(() => {
    const guesses = [...stableDictionary]

    if (
      normalizedAnswer &&
      normalizedAnswer.length === wordLength &&
      !guesses.includes(normalizedAnswer)
    ) {
      guesses.push(normalizedAnswer)
    }

    return guesses
  }, [normalizedAnswer, stableDictionary, wordLength])
  const createAnswerRef = React.useRef(() =>
    pickWord(stableDictionary, random, normalizedAnswer)
  )

  createAnswerRef.current = () =>
    pickWord(stableDictionary, random, normalizedAnswer)

  const [targetWord, setTargetWord] = React.useState(() =>
    createAnswerRef.current()
  )
  const [currentGuess, setCurrentGuess] = React.useState("")
  const [guesses, setGuesses] = React.useState<GuessResult[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const isWin = guesses.some((guess) => guess.isCorrect)
  const isLose = !isWin && guesses.length >= maxAttempts
  const gameOver = isWin || isLose
  const attemptsLeft = Math.max(0, maxAttempts - guesses.length)
  const keyboardState = React.useMemo(
    () => getKeyboardState(guesses),
    [guesses]
  )

  const addLetter = React.useCallback(
    (letter: string) => {
      if (gameOver) return

      setCurrentGuess((previous) => {
        if (previous.length >= wordLength) return previous
        return `${previous}${letter.slice(0, 1).toUpperCase()}`
      })
      setError(null)
    },
    [gameOver, wordLength]
  )

  const removeLetter = React.useCallback(() => {
    setCurrentGuess((previous) => previous.slice(0, -1))
    setError(null)
  }, [])

  const submitGuess = React.useCallback(
    (input?: string) => {
      if (gameOver) return false

      const guess = normalizeWord(input ?? currentGuess)

      if (guess.length !== wordLength) {
        setError(`Guess must be ${wordLength} letters long.`)
        return false
      }

      if (!allowedGuesses.includes(guess)) {
        setError("Guess is not in the word list.")
        return false
      }

      const evaluated = evaluateGuess(guess, targetWord)
      const nextGuess: GuessResult = {
        guess,
        tiles: evaluated,
        isCorrect: guess === targetWord,
      }

      setGuesses((previous) => [...previous, nextGuess])
      setCurrentGuess("")
      setError(null)

      return true
    },
    [allowedGuesses, currentGuess, gameOver, targetWord, wordLength]
  )

  const resetGame = React.useCallback(() => {
    setTargetWord(createAnswerRef.current())
    setCurrentGuess("")
    setGuesses([])
    setError(null)
  }, [])

  React.useEffect(() => {
    setTargetWord(createAnswerRef.current())
    setCurrentGuess("")
    setGuesses([])
    setError(null)
  }, [dictionaryKey, maxAttempts, normalizedAnswer])

  return {
    currentGuess,
    guesses,
    error,
    isWin,
    isLose,
    gameOver,
    attemptsLeft,
    keyboardState,
    targetWord,
    wordLength,
    maxAttempts,
    setCurrentGuess,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
  }
}
