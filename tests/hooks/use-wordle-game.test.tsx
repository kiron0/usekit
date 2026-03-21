import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useWordleGame } from "../../registry/hooks/use-wordle-game"

describe("useWordleGame", () => {
  it("evaluates duplicate letters correctly and tracks keyboard state", () => {
    const { result } = renderHook(() =>
      useWordleGame({
        words: ["LEVEL", "HELLO"],
        answer: "LEVEL",
      })
    )

    act(() => {
      result.current.submitGuess("hello")
    })

    expect(result.current.guesses).toHaveLength(1)
    expect(result.current.guesses[0].tiles.map((tile) => tile.status)).toEqual([
      "absent",
      "correct",
      "present",
      "present",
      "absent",
    ])
    expect(result.current.keyboardState).toMatchObject({
      H: "absent",
      E: "correct",
      L: "present",
      O: "absent",
    })
  })

  it("wins, blocks further guesses, and resets", () => {
    const { result } = renderHook(() =>
      useWordleGame({
        words: ["STACK", "REACT"],
        answer: "STACK",
      })
    )

    act(() => {
      result.current.submitGuess("stack")
    })

    expect(result.current.isWin).toBe(true)
    expect(result.current.gameOver).toBe(true)
    expect(result.current.attemptsLeft).toBe(5)

    act(() => {
      result.current.setCurrentGuess("react")
    })

    expect(result.current.submitGuess("react")).toBe(false)

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.guesses).toHaveLength(0)
    expect(result.current.isWin).toBe(false)
    expect(result.current.currentGuess).toBe("")
  })

  it("accepts an injected answer even when it is outside the guess list", () => {
    const { result } = renderHook(() =>
      useWordleGame({
        words: ["STACK", "REACT"],
        answer: "QUEUE",
      })
    )

    act(() => {
      result.current.submitGuess("queue")
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isWin).toBe(true)
    expect(result.current.guesses[0]?.guess).toBe("QUEUE")
  })

  it("resets the round when the answer changes", () => {
    const { result, rerender } = renderHook(
      ({ answer }) =>
        useWordleGame({
          words: ["STACK", "QUEUE"],
          answer,
        }),
      {
        initialProps: {
          answer: "STACK",
        },
      }
    )

    act(() => {
      result.current.submitGuess("stack")
    })

    expect(result.current.isWin).toBe(true)

    rerender({
      answer: "QUEUE",
    })

    expect(result.current.isWin).toBe(false)
    expect(result.current.guesses).toHaveLength(0)
    expect(result.current.currentGuess).toBe("")
    expect(result.current.targetWord).toBe("QUEUE")
  })
})
