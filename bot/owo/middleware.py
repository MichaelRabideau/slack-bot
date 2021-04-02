import logging
import random

from owotext import OwO

logger = logging.getLogger(__name__)
uwu = OwO()


class OwoMiddleware:
    def __init__(self):
        logger.info('registered OwoMiddleware')

    def process_output(self, input_event, output_event):
        # only uwu 50% of the time
        if not random.choice([True, False]):
            return None

        if output_event and output_event.message:
            logger.info('owofying text')
            text = uwu.whatsthis(output_event.message)
            output_event.message = text
        return output_event
