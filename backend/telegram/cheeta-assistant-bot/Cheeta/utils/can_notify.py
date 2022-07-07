from xmlrpc.client import boolean
import requests

# CONTANTS
BASE_URL = 'https://api.telegram.org/bot'
BOT_TOKEN = '5212798802:AAHCm6WC8xsaCb-Mv3ygHgzACc2q5G47-yU'

async def can_notify(user_id: int) -> boolean:
    r = requests.post(
        url=f"{BASE_URL}{BOT_TOKEN}/sendMessage?chat_id={user_id}&text=hi!!"
    )
    if r.status_code == 200:
        return True 
    return False