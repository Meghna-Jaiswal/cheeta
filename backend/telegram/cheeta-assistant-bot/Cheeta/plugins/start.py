from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta

# CONSTANTS
START_MESSAGE: str = (
    'Hey {name}!, I\'m Cheeta Assistant bot\n'
    'I can tell you about your daily\'s tasks, Click /help to know about me, what i can do more.'
)

INTRO_MESSAGE = (
    "Here is some easy steps to connect the cheeta orgin with me.\n\n"
    "1. Go to the http://cheeta.mogiio.com/userProfile and put your telegram userid which is this ( `{user_id}` ), and your username which is this ( `{username}` ).\n\n"
    "2. /checkme me, to check you got login or not.\n\n"
    "3. https://t.me/cheetaTicketsBot start ( /start ) this bot to enable cheeta notifications.\n\n" 
    "4. /can_notify to check weather you given me permission to text you or not"
)

@Cheeta.on_message(filters.command('start'))
async def start(_, message: Message):
    if len(message.command) == 1:
        await message.reply(START_MESSAGE.format(name=message.from_user.mention))
    if len(message.command) > 1:
        if 'intro' in message.command[1].split('_')[0] and message.command[1].split('_')[0] == 'intro':
            await message.reply(INTRO_MESSAGE.format(user_id=message.from_user.id, username=message.from_user.username))