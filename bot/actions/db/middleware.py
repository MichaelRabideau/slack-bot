import logging
from sqlalchemy.orm import sessionmaker

from bot.event import MessageEvent, OutputEvent
from .model import Action

logger = logging.getLogger(__name__)


def strip_bot_mention(message, bot_id):
    at = bot_id.upper()
    mentioned = False
    if at in message:
        mentioned = True
        message = message.replace(f'<@{at}>', '').strip()
    return message, mentioned


class DBActionMiddleware:
    def __init__(self, conn, bot_id):
        self.conn = conn
        self.bot_id = bot_id

    def process_output(self, input_event: MessageEvent, output_event: OutputEvent):
        if output_event:
            return None

        message, mentioned = strip_bot_mention(
            input_event.message, self.bot_id)

        session = sessionmaker(bind=self.conn)()
        result = session.query(Action).filter(
            Action.command == message).scalar()
        session.commit()

        logger.info('message: %s, mentioned: %s', message, mentioned)
        logger.info('result: %s', result)

        if not result:
            return None
        if result.mention and not mentioned:
            return None

        logger.info('responding with saved action')

        return OutputEvent(
            message=result.response,
            channel=input_event.channel,
        )
