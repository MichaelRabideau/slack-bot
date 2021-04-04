import logging
import random
from sqlalchemy import func
from sqlalchemy.orm import sessionmaker

from bot.event import MessageEvent, OutputEvent
from .model import CustomResponseCommand, CustomResponse

logger = logging.getLogger(__name__)

banned = [
    'uslackbot',
]


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
        if input_event.user_id.lower() == self.bot_id or input_event.user_id.lower() in banned:
            return None

        message, mentioned = strip_bot_mention(
            input_event.message, self.bot_id)

        session = sessionmaker(bind=self.conn)()

        result = session.query(CustomResponseCommand).filter(
            func.lower(CustomResponseCommand.command) == func.lower(message)).all()
        if not result:
            # no result, fallback to see if split tokens returns anything
            result = session.query(CustomResponseCommand).filter(
                func.lower(CustomResponseCommand.command).in_(
                    message.split(' '))).all()
            if not result:
                session.flush()
                return None

        cmd = random.choice(result)
        if not cmd:
            session.flush()
            return None

        if cmd.mention and not mentioned:
            session.flush()
            return None

        custom_response = session.query(
            CustomResponse).get(cmd.custom_response_id)
        reply = random.choice(custom_response.replies)
        if not reply:
            session.flush()
            return None

        session.commit()

        logger.info('message: %s, mentioned: %s', message, mentioned)
        logger.info('reply: %s', reply.reply)
        logger.info('responding with saved action')

        return OutputEvent(
            message=reply.reply,
            channel=input_event.channel,
        )
