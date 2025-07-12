import * as React from "react"

type Player = "X" | "O"
type Cell = Player | null

interface GameState {
  board: Cell[]
  currentPlayer: Player
  winner: Player | null
  isDraw: boolean
  gameOver: boolean
}

interface PlayerNames {
  X?: string
  O?: string
}

export function useTicTacToe(playerNames?: PlayerNames) {
  const initialState: GameState = {
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    isDraw: false,
    gameOver: false,
  }

  const [state, setState] = React.useState<GameState>(initialState)

  const checkWinner = (board: Cell[]): Player | null => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a]
      }
    }

    return null
  }

  const makeMove = (index: number) => {
    setState((prev) => {
      if (prev.board[index] || prev.gameOver) return prev

      const newBoard = [...prev.board]
      newBoard[index] = prev.currentPlayer
      const winner = checkWinner(newBoard)
      const isDraw = !winner && newBoard.every(Boolean)
      const gameOver = !!winner || isDraw

      return {
        board: newBoard,
        currentPlayer: prev.currentPlayer === "X" ? "O" : "X",
        winner,
        isDraw,
        gameOver,
      }
    })
  }

  const resetGame = () => setState(initialState)

  return {
    board: state.board,
    currentPlayer: state.currentPlayer,
    winner: state.winner,
    isDraw: state.isDraw,
    gameOver: state.gameOver,
    makeMove,
    resetGame,
    playerNames: {
      X: playerNames?.X || "Player X",
      O: playerNames?.O || "Player O",
    },
  }
}
