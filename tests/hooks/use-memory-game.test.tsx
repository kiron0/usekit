import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useMemoryGame } from "../../registry/hooks/use-memory-game"

describe("useMemoryGame", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("matches cards and completes the game", () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useMemoryGame(["A"]))

    act(() => {
      result.current.startGame()
    })

    const [first, second] = result.current.cards

    act(() => {
      result.current.flipCard(first.id)
    })

    act(() => {
      result.current.flipCard(second.id)
    })

    act(() => {
      vi.advanceTimersByTime(800)
    })

    expect(result.current.matches).toBe(1)
    expect(result.current.isGameComplete).toBe(true)
    expect(result.current.cards.every((card) => card.isMatched)).toBe(true)
  })
})
