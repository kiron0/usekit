import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useNumberGame } from "../../registry/hooks/use-number-game"

describe("useNumberGame", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("tracks guesses, history, and reset", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.4)

    const { result } = renderHook(() =>
      useNumberGame({
        min: 1,
        max: 10,
        maxAttempts: 2,
        revealTarget: true,
      })
    )

    expect(result.current.targetNumber).toBe(5)

    act(() => {
      result.current.makeGuess(3)
    })

    expect(result.current.message).toContain("Too low")
    expect(result.current.history).toEqual([{ guess: 3, label: "🔽 Too Low" }])

    act(() => {
      result.current.makeGuess(5)
    })

    expect(result.current.hasWon).toBe(true)
    expect(result.current.gameOver).toBe(true)

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.attempts).toBe(0)
    expect(result.current.history).toEqual([])
  })
})
