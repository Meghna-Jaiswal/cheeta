from pyrogram import filters
from pyrogram.types import Message
from Cheeta import Cheeta
from ..utils.get_tickets import Ticket
from ..utils.is_user_login import is_user_login

@Cheeta.on_message(filters.command('getticket'))
@is_user_login
async def get_ticket(_, message: Message):
    if len(message.command) == 1:
        return await message.reply('Please provide hdId, eg /getticket CT2311jf8603')
    text = await Ticket.get_ticket_hrid(message.from_user.id, message.command[1])
    await message.reply(text)