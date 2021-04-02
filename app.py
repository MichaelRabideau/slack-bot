# -*- coding: utf-8 -*-
import sys

from bot.bot import Bot
from bot.api import server


def main():
    args = sys.argv
    print(args)
    if len(args) == 1 or args[1] == 'bot':
        bot = Bot()
        bot.run()
    elif args[1] == 'server':
        server.run()
    print('invalid arg')
    sys.exit(1)

if __name__ == '__main__':
    main()
