import * as React from "react"

type Direction = "up" | "down" | "left" | "right"

interface Use2048GameOptions {
  size?: number
  target?: number
  initialTiles?: number
  initialBoard?: number[][]
  random?: () => number
}

function createEmptyBoard(size: number) {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

function cloneBoard(board: number[][]) {
  return board.map((row) => [...row])
}

function boardsEqual(a: number[][], b: number[][]) {
  return a.every((row, rowIndex) =>
    row.every((cell, cellIndex) => cell === b[rowIndex][cellIndex])
  )
}

function transpose(board: number[][]) {
  return board[0].map((_, columnIndex) => board.map((row) => row[columnIndex]))
}

function reverseRows(board: number[][]) {
  return board.map((row) => [...row].reverse())
}

function compressRow(row: number[]) {
  const compact = row.filter(Boolean)
  const merged: number[] = []
  let score = 0

  for (let index = 0; index < compact.length; index += 1) {
    const current = compact[index]
    const next = compact[index + 1]

    if (next && current === next) {
      const value = current * 2
      merged.push(value)
      score += value
      index += 1
    } else {
      merged.push(current)
    }
  }

  while (merged.length < row.length) {
    merged.push(0)
  }

  return { row: merged, score }
}

function moveLeft(board: number[][]) {
  let score = 0
  const moved = board.map((row) => {
    const next = compressRow(row)
    score += next.score
    return next.row
  })

  return { board: moved, score }
}

function normalizeBoardForDirection(board: number[][], direction: Direction) {
  if (direction === "left") return cloneBoard(board)
  if (direction === "right") return reverseRows(board)
  if (direction === "up") return transpose(board)
  return reverseRows(transpose(board))
}

function restoreBoardFromDirection(board: number[][], direction: Direction) {
  if (direction === "left") return board
  if (direction === "right") return reverseRows(board)
  if (direction === "up") return transpose(board)
  return transpose(reverseRows(board))
}

function getEmptyCells(board: number[][]) {
  const cells: Array<{ row: number; column: number }> = []

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        cells.push({ row: rowIndex, column: columnIndex })
      }
    })
  })

  return cells
}

function addRandomTile(board: number[][], random: () => number) {
  const emptyCells = getEmptyCells(board)

  if (emptyCells.length === 0) {
    return board
  }

  const index = Math.min(
    emptyCells.length - 1,
    Math.floor(random() * emptyCells.length)
  )
  const { row, column } = emptyCells[index]
  const value = random() < 0.9 ? 2 : 4
  const nextBoard = cloneBoard(board)

  nextBoard[row][column] = value

  return nextBoard
}

function canMove(board: number[][]) {
  if (getEmptyCells(board).length > 0) return true

  for (let row = 0; row < board.length; row += 1) {
    for (let column = 0; column < board[row].length; column += 1) {
      const current = board[row][column]
      const right = board[row][column + 1]
      const down = board[row + 1]?.[column]

      if (current === right || current === down) {
        return true
      }
    }
  }

  return false
}

function bestTile(board: number[][]) {
  return Math.max(...board.flat())
}

export function use2048Game(options: Use2048GameOptions = {}) {
  const {
    size = 4,
    target = 2048,
    initialTiles = 2,
    initialBoard,
    random = Math.random,
  } = options

  const createBoard = React.useCallback(() => {
    if (initialBoard) {
      return cloneBoard(initialBoard)
    }

    let board = createEmptyBoard(size)

    for (let index = 0; index < initialTiles; index += 1) {
      board = addRandomTile(board, random)
    }

    return board
  }, [initialBoard, initialTiles, random, size])

  const [board, setBoard] = React.useState<number[][]>(() => createBoard())
  const [score, setScore] = React.useState(0)

  const move = React.useCallback(
    (direction: Direction) => {
      let moved = false

      setBoard((previous) => {
        const normalized = normalizeBoardForDirection(previous, direction)
        const shifted = moveLeft(normalized)
        const restored = restoreBoardFromDirection(shifted.board, direction)

        if (boardsEqual(previous, restored)) {
          return previous
        }

        moved = true
        setScore((currentScore) => currentScore + shifted.score)

        return addRandomTile(restored, random)
      })

      return moved
    },
    [random]
  )

  const resetGame = React.useCallback(() => {
    setBoard(createBoard())
    setScore(0)
  }, [createBoard])

  return {
    board,
    score,
    bestTile: bestTile(board),
    hasWon: bestTile(board) >= target,
    isGameOver: !canMove(board),
    size,
    target,
    move,
    resetGame,
    canMove: canMove(board),
  }
}
