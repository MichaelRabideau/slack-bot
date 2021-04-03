import schedule
import requests

from bot import config
from bot.scheduler import add_schedule


@add_schedule(name='healthcheck', schedule=schedule.every(15).minutes, channel='#choboi-logs')
def healthcheck(*args, **kwargs):
    # ping api every 15 minutes so heroku free dyno doesn't sleep
    url = config.API_URL + '/health'
    response = requests.get(url)
    if response.status_code == 200:
        return 'healthcheck: ok'
    return 'healthcheck: error'
