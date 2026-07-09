import { getMovieDetailPath } from '@/lib/routes'

async function canonicalizeLink(linkUrl?: string) {
  if (!linkUrl) return linkUrl

  const match = linkUrl.match(/\/(movie|series)\/(\d+)(?:[/?#].*)?$/)
  if (!match) return linkUrl

  try {
    const url = new URL(linkUrl)
    const response = await fetch(new URL(`/api/movies/${match[2]}`, url.origin))
    if (!response.ok) return linkUrl

    const movie = await response.json()
    if (!movie?.id || !movie?.type) return linkUrl

    return `${url.origin}${getMovieDetailPath(movie)}`
  } catch {
    return linkUrl
  }
}

export async function sendTelegramNotification(message: string, posterUrl?: string, linkUrl?: string) {
  const BOT_TOKEN = process.env.WATCHIT_TELEGRAM_BOT_TOKEN?.trim();
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID?.trim();

  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.warn('Telegram bot token or channel ID not found in environment variables.');
    return;
  }

  console.log(`Attempting to send Telegram notification to channel: ${JSON.stringify(CHANNEL_ID)}`);
  const baseUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;

  // Pre-check: Verify bot token
  try {
    const meResp = await fetch(`${baseUrl}/getMe`);
    const meData = await meResp.json();
    if (meData.ok) {
      console.log(`Bot verified: @${meData.result.username}`);
    } else {
      console.error('Invalid Bot Token!', meData);
    }
  } catch (e) {
    console.error('Error verifying bot token:', e);
  }
  // Aggressively clean the channel ID to remove any hidden characters
  const cleanChannelId = CHANNEL_ID.replace(/[^\d-]/g, '');

  console.log(`Cleaned Channel ID: "${cleanChannelId}"`);

  let validLinkUrl = await canonicalizeLink(linkUrl);
  if (validLinkUrl && validLinkUrl.includes('localhost')) {
    // Telegram API rejects localhost URLs in inline keyboards.
    // Replace with a dummy domain for local testing.
    validLinkUrl = validLinkUrl.replace(/http:\/\/localhost:\d+/, 'https://your-site.com');
  }

  const replyMarkup = validLinkUrl ? {
    inline_keyboard: [
      [{ text: 'Click here to watch', url: validLinkUrl }]
    ]
  } : undefined;

  async function trySendPhoto() {
    if (!posterUrl) return false;
    try {
      const response = await fetch(`${baseUrl}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: parseInt(cleanChannelId, 10),
          photo: posterUrl,
          caption: message,
          parse_mode: 'HTML',
          ...(replyMarkup && { reply_markup: replyMarkup }),
        }),
      });
      if (response.ok) return true;
      console.error('Telegram sendPhoto failed:', await response.text());
      return false;
    } catch (error) {
      console.error('Telegram sendPhoto error:', error);
      return false;
    }
  }

  async function trySendMessage() {
    try {
      const response = await fetch(`${baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: parseInt(cleanChannelId, 10),
          text: message,
          parse_mode: 'HTML',
          ...(replyMarkup && { reply_markup: replyMarkup }),
        }),
      });
      if (response.ok) return true;
      console.error('Telegram sendMessage failed:', await response.text());
      return false;
    } catch (error) {
      console.error('Telegram sendMessage error:', error);
      return false;
    }
  }

  // Try photo first, then fallback to message
  const photoSent = await trySendPhoto();
  if (!photoSent) {
    await trySendMessage();
  }
}
