from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta

# CONSTANTS
INTRO_MESSAGE = (
    "Here is some easy steps to connect the cheeta orgin with me.\n\n"
    "1. Go to the http://cheeta.mogiio.com/userProfile and put your telegram userid which is this ( `{userid}` ), and your username which is this ( `{username}` ).\n\n"
    "2. /checkme me, to check you got login or not.\n\n"
    "3. https://t.me/cheetaTicketsBot start ( /start ) this bot to enable cheeta notifications.\n\n" 
    "4. /can_notify to check weather you given me permission to text you or not"
)

@Cheeta.on_message(filters.command('intro'))
async def checkme(_, message: Message):
    await message.reply(INTRO_MESSAGE.format(userid=message.from_user.id, username=message.from_user.username))