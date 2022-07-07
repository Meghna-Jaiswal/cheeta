from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta
from ..utils.check_me import checkme

@Cheeta.on_message(filters.command('checkme'))
async def start(_, message: Message):
    if await checkme(message.from_user.id):
        return await message.reply('You are successfully logged in with cheeta origin, you can check my further commands.')
    await message.reply('You havn\'t logged yet, please make sure you get login first.')