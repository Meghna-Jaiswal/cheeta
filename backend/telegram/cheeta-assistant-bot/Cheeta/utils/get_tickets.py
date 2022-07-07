import requests
from load_configs import LoadConfigs
from .get_id import get_cheeta_id

configs: set = LoadConfigs().get_configs()

CHEETA_TICKETS_URI = configs.get("CHEETA_TICKETS_URI")
JWT_TOKEN = configs.get("JWT_TOKEN")


class Ticket:
    async def get_tickets(user_id: int):
        userId = await get_cheeta_id(user_id)
        if userId == None:
            return
        r = requests.post(
            url=f"{CHEETA_TICKETS_URI}/getTickets/",
            headers={"Authorization": JWT_TOKEN},
            json={"members": [userId]},
        )
        if r.status_code != 200:
            return

        message = "Here all active tickets: \n\n"
        for i in r.json().get("data"):
            message += (
                f" • {i.get('title')} `({i.get('hrId')})`\n"
                f"      priority: {i.get('priority')}\n"
                f"      type: {i.get('type')}\n"
                f"      state: {i.get('state')}\n"
            )
        return message

    async def get_ticket_hrid(user_id: int, hr_id: str):
        userId = await get_cheeta_id(user_id)
        if userId == None:
            return
        r = requests.get(
            url=f"{CHEETA_TICKETS_URI}/search?term={hr_id}",
            headers={"Authorization": JWT_TOKEN},
            json={"members": [userId]},
        )
        if r.status_code != 200:
            return
        ticket = r.json().get("data")[0]
        return (
            f"here is your {hr_id}'s ticket:\n\n"
            f"title: {ticket.get('title')}\n"
            f"description: {ticket.get('description')}\n"
            f"priority: {ticket.get('priority')}\n"
            f"type: {ticket.get('type')}\n"
        )
