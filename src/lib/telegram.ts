/**
 * Telegram Bot Helper
 * Handles sending OTPs and interaction logic.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, message: string) {
    if (!BOT_TOKEN) {
        console.warn("[TELEGRAM] Missing TELEGRAM_BOT_TOKEN. Code will be logged below (Mock Mode):");
        console.log(`[MOCK TELEGRAM] To ${chatId}: ${message}`);
        return { success: true, mock: true };
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        return { success: data.ok, data };
    } catch (error) {
        console.error("[TELEGRAM] Error sending message:", error);
        return { success: false, error };
    }
}

/**
 * Generates a numeric OTP
 */
export function generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}
/**
 * Sets the Telegram Webhook URL
 */
export async function setTelegramWebhook(url: string) {
    if (!BOT_TOKEN) return { success: false, error: "No token" };
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: `${url}/api/webhooks/telegram` })
        });
        const data = await response.json();
        return { success: data.ok, data };
    } catch (error) {
        return { success: false, error };
    }
}
