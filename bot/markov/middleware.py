import logging

from bot.event import MessageEvent, OutputEvent
from .model import get_model

logger = logging.getLogger(__name__)


class MarkovifyMiddleware:

    def __init__(self, bot_id):
        logger.info('registered MarkovifyMiddleware')
        self.bot_id = bot_id.lower()

        # warm up model on start
        get_model()

    # only come up with a markov response if the output_event is None (e.g. no
    # command resolved)
    def process_output(self, input_event: MessageEvent, output_event: OutputEvent):
        logger.info(input_event)
        logger.info(output_event)
        if output_event:
            return None

        # not mentioned
        if self.bot_id not in input_event.message.lower():
            return None

        logger.info('no output event and mentioned, processing markov response')

        response = get_model().generate_response()
        return OutputEvent(
            channel=input_event.channel,
            message=response,
        )
