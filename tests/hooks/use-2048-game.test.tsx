import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { use2048Game } from "../../registry/hooks/use-2048-game"

describe("use2048Game", () => {
  it("merges tiles, updates score, and spawns a deterministic tile", () => {
    const randomValues = [0, 0]
    const { result } = renderHook(() =>
      use2048Game({
        initialBoard: [
          [2, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        random: () => randomValues.shift() ?? 0,
      })
    )

    act(() => {
      result.current.move("left")
    })

    expect(result.current.board[0]).toEqual([4, 2, 0, 0])
    expect(result.current.score).toBe(4)
    expect(result.current.bestTile).toBe(4)
    expect(result.current.canMove).toBe(true)
  })

  it("detects game over boards and resets", () => {
    const { result } = renderHook(() =>
      use2048Game({
        initialBoard: [
          [2, 4, 2, 4],
          [4, 2, 4, 2],
          [2, 4, 2, 4],
          [4, 2, 4, 8],
        ],
      })
    )

    expect(result.current.isGameOver).toBe(true)
    expect(result.current.canMove).toBe(false)

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.board.flat().some((cell) => cell !== 0)).toBe(true)
    expect(result.current.score).toBe(0)
  })
})
