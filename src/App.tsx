import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameModal from './components/GameModal'
import AnimatedBackground from './components/AnimatedBackground'
import { checkWinner, isBoardFull, generatePromoCode } from './utils/gameLogic'
import { sendTelegramMessage } from './utils/telegram'
import './App.css'

type Player = 'X' | 'O' | null
type GameStatus = 'playing' | 'won' | 'lost' | 'draw'

function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setGameStatus('playing')
    setPromoCode(null)
    setIsModalOpen(false)
  }

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') {
      return
    }

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)

    const winner = checkWinner(newBoard)
    if (winner === 'X') {
      const code = generatePromoCode()
      setPromoCode(code)
      setGameStatus('won')
      setIsModalOpen(true)
      sendTelegramMessage(`Победа! Промокод выдан: ${code}`)
      return
    }

    if (isBoardFull(newBoard)) {
      setGameStatus('draw')
      setIsModalOpen(true)
      return
    }

    setIsPlayerTurn(false)
  }

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const computerMove = getBestMove(board)
        if (computerMove !== -1) {
          const newBoard = [...board]
          newBoard[computerMove] = 'O'
          setBoard(newBoard)

          const winner = checkWinner(newBoard)
          if (winner === 'O') {
            setGameStatus('lost')
            setIsModalOpen(true)
            sendTelegramMessage('Проигрыш')
          } else if (isBoardFull(newBoard)) {
            setGameStatus('draw')
            setIsModalOpen(true)
          } else {
            setIsPlayerTurn(true)
          }
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, board, gameStatus])

  return (
    <div className="app">
      <AnimatedBackground />
      <div className="app-container">
        <h1 className="app-title">✨ Крестики-нолики ✨</h1>
        <GameBoard board={board} onCellClick={handleCellClick} disabled={!isPlayerTurn || gameStatus !== 'playing'} />
        {isModalOpen && (
          <GameModal
            status={gameStatus as 'won' | 'lost' | 'draw'}
            promoCode={promoCode}
            onPlayAgain={resetGame}
          />
        )}
      </div>
    </div>
  )
}

function getBestMove(board: Player[]): number {
  // Вероятность случайного хода вместо оптимального (70%)
  const randomChance = 0.7
  
  // Вероятность пропустить критичный ход (30%)
  const missCriticalChance = 0.3
  
  // Проверяем критичные ходы, но иногда их пропускаем
  const criticalMove = findCriticalMove(board)
  if (criticalMove !== -1 && Math.random() > missCriticalChance) {
    return criticalMove
  }

  // В большинстве случаев делаем случайный ход
  if (Math.random() < randomChance) {
    const availableMoves = board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1)
    
    if (availableMoves.length > 0) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)]
    }
  }

  // Иногда используем упрощенную логику вместо minimax
  // Просто выбираем случайную свободную ячейку или центр/углы
  const availableMoves = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1)

  if (availableMoves.length > 0) {
    // Предпочитаем центр и углы, но не всегда
    const preferredMoves = [4, 0, 2, 6, 8].filter(move => availableMoves.includes(move))
    if (preferredMoves.length > 0 && Math.random() > 0.5) {
      return preferredMoves[Math.floor(Math.random() * preferredMoves.length)]
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  return -1
}

function findCriticalMove(board: Player[]): number {
  // Проверяем, может ли компьютер выиграть
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O'
      if (checkWinner(board) === 'O') {
        board[i] = null
        return i
      }
      board[i] = null
    }
  }

  // Проверяем, нужно ли блокировать игрока
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'X'
      if (checkWinner(board) === 'X') {
        board[i] = null
        return i
      }
      board[i] = null
    }
  }

  return -1
}

export default App

