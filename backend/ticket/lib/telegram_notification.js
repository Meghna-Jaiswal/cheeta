const getUser = require("./getUser");
const sendMessageTelegram = require("./sendMessageTelegram");

let CHEETA_TELEGRAM_CHAT_ID;
if (process.env.NAMESPACE_JK === 'prod') {
    CHEETA_TELEGRAM_CHAT_ID = process.env.CHEETA_TELEGRAM_CHAT_ID || -1001595598292
}

class TelegramNotification {
    members;
    message;

    constructor(members, message) {
        this.members = members
        this.message = message
    }

    async init() {
        console.log('sending message to telegram')
        try {
            if (CHEETA_TELEGRAM_CHAT_ID) await sendMessageTelegram(CHEETA_TELEGRAM_CHAT_ID, this.message)
        } catch (err) {
            console('got error while sending message in group')
        } finally {
            for (let id of this.members.map((key) => key.userId)) {
                await getUser(id).then(async (res) => {
                    if (res.telegram && res.telegram.id) {
                        try {
                            await sendMessageTelegram(res.telegram.id, this.message)
                        } catch (err) {
                            console.log('got err', err)
                        }
                    } else {
                        console.log(`skipping res ${res.title}...`)
                    }
                })
            }
        }
    }

}

module.exports = TelegramNotification