import os
import time
import sys
from pyrogram import Client
from pyrogram import __version__
from pyrogram.raw.all import layer
from load_configs import LoadConfigs


class Cheeta(Client):
    """ 
    Cheeta Custom Client
    """

    # loading up all local env variables
    configs: set = LoadConfigs().get_configs()
    chat: int
    bot: set = {}

    def __init__(self):
        super().__init__(
            'CheetaSession',
            api_id=self.configs.get('API_ID'),
            api_hash=self.configs.get('API_HASH'),
            bot_token=self.configs.get('BOT_TOKEN'),
            plugins=dict(
                root=f"Cheeta.plugins"
            ),
            sleep_threshold=180
        )

        self.start_time = time.time()
        Cheeta.chat = self.configs.get('CHAT_ID')

    async def start(self):
        await super().start()

        me = await self.get_me()
        Cheeta.bot['id'] = me.id
        Cheeta.bot['username'] = me.username 
        Cheeta.bot['first_name'] = me.first_name

        if not (me.is_bot):
            sys.exit(
                'human beings are not allowed to use this bot, distroying your created cached instances...')
        print(
            f"Cheeta Assistant bot v{__version__} (Layer {layer}) started on @{me.username}.")
    

    async def stop(self, *args):
        await super().stop()
        print(
            f"Cheeta  Assistant bot stopped. Bye.\ntotal running time was - {time.time() - self.start_time} seconds.")