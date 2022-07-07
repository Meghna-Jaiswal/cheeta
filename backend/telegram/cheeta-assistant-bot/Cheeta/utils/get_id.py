import requests
from load_configs import LoadConfigs

configs: set = LoadConfigs().get_configs()

CHEETA_USER_URI = configs.get("CHEETA_USERS_URI")
JWT_TOKEN = configs.get('JWT_TOKEN')

async def get_cheeta_id(user_id: int) -> str:
    r = requests.get(
        f"{CHEETA_USER_URI}telegram/{user_id}",
        headers={"Authorization": JWT_TOKEN},
    )
    if r.status_code == 200:
        return r.json().get('data').get('_id')
