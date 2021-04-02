import logging
import time

from bot import actions # pylint: disable=unused-import
from bot.event import OutputEvent
from bot.resolver import resolve

logger = logging.getLogger(__name__)


class Handler:
    """
    Handler reads input events from the input queue and processes them.  If
    there are any outputs, it appends the OutputEvent onto the output queue.
    """

    def __init__(self, input_queue, output_queue, bot_id, delay, db, middlewares):
        self.input_queue = input_queue
        self.output_queue = output_queue
        self.bot_id = bot_id
        self.delay = delay
        self.alive = True
        self.db = db
        self.middlewares = middlewares

    def run(self):
        while self.alive:
            try:
                time.sleep(self.delay)
                input_event = self.input_queue.get()
                if input_event:
                    # request middleware
                    for middleware in self.middlewares:
                        if hasattr(middleware, 'process_input'):
                            ie = middleware.process_input(input_event)
                            if ie:
                                input_event = ie
                    # resolve
                    output_event = self.__resolve(input_event)

                    # output middleware (reverse order)
                    for middleware in self.middlewares[::-1]:
                        if hasattr(middleware, 'process_output'):
                            oe = middleware.process_output(input_event, output_event)
                            if oe:
                                output_event = oe

                    self.__respond(output_event)
            except Exception as ex:
                logger.error("error: %s", ex)

    def __respond(self, output_event):
        if output_event:
            logger.info("resolved message: %s", output_event)
            self.output_queue.put_nowait(output_event)

    def __resolve(self, input_event):
        """
        resolves an input event into an output event
        """
        logger.info(input_event)
        cmd = resolve(input_event.message, at=self.bot_id, handle_default=True)
        logger.info("resolved action: %s", cmd)
        if not cmd:
            return None

        message = cmd.action(
            *cmd.args,
            user=input_event.user_id,
            message=input_event.message,
            channel=input_event.channel,
            conn=self.db,
        )
        return OutputEvent(
            channel=input_event.channel,
            message=message)
