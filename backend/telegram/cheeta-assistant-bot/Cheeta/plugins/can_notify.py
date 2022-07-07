from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta
from ..utils.can_notify import can_notify

@Cheeta.on_message(filters.command('can_notify'))
async def _can_notify(_, message: Message):
    if await can_notify(message.from_user.id):
        return await message.reply('You have enabled cheeta notifications.\n')
    await message.reply('You havent enabled cheeta notification yet!\n Please enable it to get cheeta notification')