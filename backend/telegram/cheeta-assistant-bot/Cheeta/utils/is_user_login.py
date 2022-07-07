from .check_me import checkme
from pyrogram.types import Message


def is_user_login(func):
    async def wrap(client, message: Message):
        if not await checkme(message.from_user.id):
            return await message.reply(
                'Please login, first then use this command... press /intro and login!'
            )
        else:
            return await func(client, message)

    return wrap