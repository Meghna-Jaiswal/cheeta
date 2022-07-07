import requests
from load_configs import LoadConfigs

configs: set = LoadConfigs().get_configs()

CHEETA_URI =  configs.get('CHEETA_USERS_URI')
JWT_TOKEN = configs.get('JWT_TOKEN')

async def checkme(userid: int) -> bool:
    r = requests.get(f'{CHEETA_URI}/telegram/{userid}'.format(userid=userid), headers={'Authorization': JWT_TOKEN})
    if r.status_code != 200:
        return False
    else:
        return True