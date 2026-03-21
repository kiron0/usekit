import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Difficulty, useSnakeGame } from "../../registry/hooks/use-snake-game"

describe("useSnakeGame", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("starts moving the snake on an interval and resets cleanly", () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useSnakeGame(Difficulty.EASY))

    act(() => {
      result.current.startGame()
    })

    act(() => {
      vi.advanceTimersByTime(220)
    })

    expect(result.current.isRunning).toBe(true)
    expect(result.current.snake[0]).toEqual({ x: 11, y: 10 })

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.isRunning).toBe(false)
    expect(result.current.score).toBe(0)
    expect(result.current.snake).toEqual([{ x: 10, y: 10 }])
  })
})
