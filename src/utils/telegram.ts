const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || ''

export async function sendTelegramMessage(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot token or chat ID not configured. Message:', message)
    return
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    })

    if (!response.ok) {
      console.error('Failed to send Telegram message:', await response.text())
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error)
  }
}

