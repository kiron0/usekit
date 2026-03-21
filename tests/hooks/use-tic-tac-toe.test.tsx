import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useTicTacToe } from "../../registry/hooks/use-tic-tac-toe"

describe("useTicTacToe", () => {
  it("plays a winning round and resets the board", () => {
    const { result } = renderHook(() =>
      useTicTacToe({
        X: "Alice",
        O: "Bob",
      })
    )

    act(() => {
      result.current.makeMove(0)
      result.current.makeMove(3)
      result.current.makeMove(1)
      result.current.makeMove(4)
      result.current.makeMove(2)
    })

    expect(result.current.winner).toBe("X")
    expect(result.current.gameOver).toBe(true)
    expect(result.current.playerNames).toEqual({ X: "Alice", O: "Bob" })

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.board).toEqual(Array(9).fill(null))
    expect(result.current.winner).toBeNull()
  })
})
