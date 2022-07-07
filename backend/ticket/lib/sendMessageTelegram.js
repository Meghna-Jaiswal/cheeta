const axios = require('axios');

const TELEGRAM_BASE_URI = 'https://api.telegram.org/bot'
const BOT_TOKEN = process.env.CHEETA_TICKET_BOT_TOKEN | '5212798802:AAHCm6WC8xsaCb-Mv3ygHgzACc2q5G47-yU'

/**
 * Telegram send message
 * @param {integer} chat_id 
 * @param {string} message 
 * @returns 
 */
async function sendMessageTelegram(chat_id, message) {

    return new Promise((resolve, reject) => {

        try {
            console.log(`sending message to ${chat_id} this message: ${message}`);
            var options = {
                method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                url: encodeURI(`${TELEGRAM_BASE_URI}5212798802:AAHCm6WC8xsaCb-Mv3ygHgzACc2q5G47-yU/sendMessage?chat_id=${chat_id}&text=${message}`),
                body: JSON.stringify({
                    text: 'Required',
                    parse_mode: 'Optional',
                    disable_web_page_preview: false,
                    disable_notification: false
                  }),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            axios(options).then(async (response) => {
                if (response) {
                    resolve(response)
            } else {
                    resolve(false)
                }
            }).catch((err) => {
                console.log("got error while sending message to telegram #1 : ", err);
                resolve(false)
            })
        }

        catch (error) {
            console.log("got error while sending message to telegram #2", error);
            resolve(false)
        }
    })
}


module.exports = sendMessageTelegram;