from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta
from ..utils.get_tickets import Ticket
from ..utils.is_user_login import is_user_login

@Cheeta.on_message(filters.command('gettickets'))
@is_user_login
async def start(_, message: Message):
    text = await Ticket.get_tickets(message.from_user.id)
    await message.reply(text)