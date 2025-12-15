import './GameBoard.css'

type Player = 'X' | 'O' | null

interface GameBoardProps {
  board: Player[]
  onCellClick: (index: number) => void
  disabled: boolean
}

function GameBoard({ board, onCellClick, disabled }: GameBoardProps) {
  return (
    <div className="game-board">
      {board.map((cell, index) => (
        <button
          key={index}
          className={`game-cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${disabled ? 'cell-disabled' : ''}`}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
          aria-label={`Cell ${index + 1}`}
        >
          {cell && <span className="cell-content">{cell}</span>}
        </button>
      ))}
    </div>
  )
}

export default GameBoard

