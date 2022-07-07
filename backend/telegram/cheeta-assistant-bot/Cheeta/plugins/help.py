from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta

# CONSTANTS
HELP_MESSAGE: str = (
    'Here is some my command that i can perform.\n\n'
    '- /id: get your telegram userid/chatid.\n'
    '- /checkme: check me, if I\'m login with cheeta or not.\n'
    '- /intro: Intro message, how to login with cheeta.\n'
)

@Cheeta.on_message(filters.command('help'))
async def help(_, message: Message):
    await message.reply(HELP_MESSAGE)