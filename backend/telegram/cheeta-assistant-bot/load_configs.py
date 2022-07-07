import os
import sys
from dotenv import load_dotenv


class LoadConfigs():
    """
    this class helps to load all local machine env variables
    """

    def __init__(self):
        BRANCH_NAME: str = 'local'
        if(os.environ.get('BRANCH_NAME') != None):
            BRANCH_NAME: str = os.environ.get('BRANCH_NAME')
        else:
            print(
                'detected local machine enviroment, seeting up your bot for local enviroment...')

        # Loading up env variables
        print(f'loading up {BRANCH_NAME}.env file...')
        load_dotenv(f'environment/{BRANCH_NAME}.env')

    def get_configs(self) -> dict:
        """
        storing all varibles in a object
        """

        # Configrations setting up
        configs = {}
        try:
            configs['API_ID']: int = int(os.environ.get('API_ID'))
        except:
            sys.exit(
                'got missing variable, please put API_ID variable in your machine.\n exiting system...')

        try:
            configs['API_HASH']: str = os.environ.get('API_HASH')
        except:
            sys.exit(
                'got missing variable, please put API_HASH variable in your machine.\n exiting system...')

        try:
            configs['BOT_TOKEN']: str = os.environ.get('BOT_TOKEN')
        except:
            sys.exit(
                'got missing variable, please put BOT_TOKEN variable in your machine.\n exiting system...')

        try:
            configs['CHAT_ID']: int = int(os.environ.get('CHAT_ID'))
        except:
            sys.exit(
                'got missing variable, please put CHAT_ID variable in your machine.\n exiting system...')

        try:
            configs['SUDOS']: str = os.environ.get('SUDOS').split(' ')
        except:
            configs.SUDOS = []
        
        try:
            configs['CHEETA_USERS_URI']: str = os.environ.get('CHEETA_USERS_URI')
        except:
            sys.exit(
                'got missing variable, please put CHEETA_USERS_URI variable in your machine.\n exiting system...')
        
        try:
            configs['CHEETA_TICKETS_URI']: str = os.environ.get('CHEETA_TICKETS_URI')
        except:
            sys.exit(
                'got missing variable, please put CHEETA_TICKETS_URI variable in your machine.\n exiting system...')
        
        try:
            configs['JWT_TOKEN']: str = os.environ.get('JWT_TOKEN')
        except:
            sys.exit(
                'got missing variable, please put JWT_TOKEN variable in your machine.\n exiting system...')

        return configs
