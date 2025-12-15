import './GameModal.css'

interface GameModalProps {
  status: 'won' | 'lost' | 'draw'
  promoCode: string | null
  onPlayAgain: () => void
}

function GameModal({ status, promoCode, onPlayAgain }: GameModalProps) {
  const handleClick = () => {
    onPlayAgain()
  }

  return (
    <div className="modal-overlay" onClick={handleClick}>
      <div className="modal-content" onClick={handleClick}>
        {status === 'won' && (
          <div className="modal-won">
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">Поздравляем!</h2>
            <p className="modal-message">Вы выиграли!</p>
            {promoCode && (
              <>
                <div className="promo-code-container">
                  <p className="promo-label">Ваш промокод на скидку:</p>
                  <div className="promo-code">{promoCode}</div>
                </div>
                <div className="telegram-notice">
                  <span className="telegram-icon">📱</span>
                  <span className="telegram-text">Промокод придёт в Telegram-бот</span>
                  <a 
                    href="https://t.me/dolgikhgram_bot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="telegram-bot"
                    onClick={(e) => e.stopPropagation()}
                  >
                    @dolgikhgram_bot
                  </a>
                </div>
              </>
            )}
            <button className="modal-button" onClick={onPlayAgain}>
              Играть снова
            </button>
          </div>
        )}

        {status === 'lost' && (
          <div className="modal-lost">
            <div className="modal-icon">💔</div>
            <h2 className="modal-title">Не расстраивайтесь!</h2>
            <p className="modal-message">Попробуйте ещё раз</p>
            <button className="modal-button" onClick={onPlayAgain}>
              Играть снова
            </button>
          </div>
        )}

        {status === 'draw' && (
          <div className="modal-draw">
            <div className="modal-icon">🤝</div>
            <h2 className="modal-title">Ничья!</h2>
            <p className="modal-message">Попробуйте ещё раз</p>
            <button className="modal-button" onClick={onPlayAgain}>
              Играть снова
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameModal

