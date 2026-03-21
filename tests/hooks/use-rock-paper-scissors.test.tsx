import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useRockPaperScissors } from "../../registry/hooks/use-rock-paper-scissors"

describe("useRockPaperScissors", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("records wins and resets state", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9)

    const { result } = renderHook(() => useRockPaperScissors())

    act(() => {
      result.current.play("rock")
    })

    expect(result.current.computerChoice).toBe("scissors")
    expect(result.current.result).toBe("win")
    expect(result.current.score).toEqual({ wins: 1, losses: 0, draws: 0 })

    act(() => {
      result.current.reset()
    })

    expect(result.current.result).toBeNull()
    expect(result.current.score).toEqual({ wins: 0, losses: 0, draws: 0 })
  })
})
