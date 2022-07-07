from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta


@Cheeta.on_message(filters.command('id'))
async def id(_, message: Message):
    await message.reply(
        f'{message.from_user.mention}\'s id: `{message.from_user.id}`\n'
        f'chat\'s id: `{message.chat.id}`'
    )