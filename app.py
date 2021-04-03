# -*- coding: utf-8 -*-
import sys

from bot import config
from bot.bot import Bot
from bot.api import server

app = server.app


def main():
    args = sys.argv
    if len(args) == 1 or args[1] == 'bot':
        bot = Bot()
        bot.run()
    else:
        app.run(threaded=True, port=config.PORT)


if __name__ == '__main__':
    main()
