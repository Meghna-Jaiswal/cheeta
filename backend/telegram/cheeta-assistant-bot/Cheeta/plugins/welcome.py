from pyrogram import filters
from pyrogram.types import Message
from pyrogram.types import (InlineKeyboardButton,
                            InlineKeyboardMarkup)
from Cheeta import Cheeta


@Cheeta.on_message(filters.new_chat_members)
async def welcome(_, message: Message):
    new_members = [f"{u.mention}" for u in message.new_chat_members]
    text = (
        f"Welcome to Mogi Family's group chat {', '.join(new_members)}!\n"
        "I'm here to assist your about cheeta.\n"
        "Click on the below button to login with cheeta orgin."
    )
    button = InlineKeyboardMarkup(
        [[InlineKeyboardButton(text='Check me', url=f"http://t.me/{Cheeta.bot.get('username')}?start=intro_{message.from_user.id}")]]
    )
    await message.reply_text(text, reply_markup=button, disable_web_page_preview=True)