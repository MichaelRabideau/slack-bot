# -*- coding: utf-8 -*-
import os
import logging
import time
import threading
import queue
from collections import namedtuple

from slackclient import SlackClient

from .resolver import resolve


BOT_ID = os.environ.get('SLACK_BOT_ID', 'U3BMAJT2A')
SLACK_TOKEN = os.environ.get('SLACK_CHOBOI_API_TOKEN')

READ_WEBSOCKET_DELAY = 0.5
WRITE_DELAY = 0.5

logger = logging.getLogger(__name__)


class SlackEvents:
    Message = namedtuple('Message', ['command', 'channel', 'user'])
    Error = namedtuple('Error', ['error', 'code', 'msg'])


class Bot:
    default_channel = "#general"

    num_writers = 1
    num_listeners = 1

    def __init__(self):
        self.at_bot = "<@{}>".format(BOT_ID)
        self.client = SlackClient(SLACK_TOKEN)
        self.resolved_commands = queue.LifoQueue()
        self.threads = []

    def connect(self):
        """
        Connect to bot client
        """
        if not self.client.rtm_connect():
            raise Exception()
        logger.info("Bot connected")
        try:
            for i in range(self.num_listeners):
                self.threads.append(threading.Thread(target=self._listen))
            for i in range(self.num_writers):
                self.threads.append(threading.Thread(target=self._respond))
            for thread in self.threads:
                thread.start()
        except Exception as ex:
            logging.error("Error occurred: {}".format(ex))
        finally:
            self.resolved_commands.join()

    def _listen(self):
        """
        Append slack output to the shared output queue
        """
        while True:
            time.sleep(READ_WEBSOCKET_DELAY)
            try:
                output_list = self.client.rtm_read()
                if output_list and len(output_list) == 0:
                    continue

                commands = self.__process_output(output_list)
                for command in commands:
                    self.resolved_commands.put_nowait(command)
            except Exception as ex:
                logging.error("_listen exception: {}".format(ex))

    def _respond(self):
        """
        TODO : RTM?
        """
        while True:
            time.sleep(WRITE_DELAY)
            try:
                if self.resolved_commands.empty():
                    continue
                output = self.resolved_commands.get()
                if isinstance(output, SlackEvents.Error):
                    self.__respond_with_error(output)
                else:
                    self.__respond_with_message(output)
            except Exception as ex:
                logging.error("_respond exception: {}".format(ex))

    def __process_output(self, output_list):
        """
        process output

        TODO output list content should be one type
        """
        resolved = []
        for output in output_list:
            if not output:
                continue

            sanitized = None
            if output.get('type') == 'error':
                sanitized = self.__process_error(output)
            elif output.get('type') == 'message':
                if output.get('user') != BOT_ID:
                    sanitized = self.__process_message(output)
            else:
                logger.info("Processing unhandled: {}".format(output))

            if sanitized:
                resolved.append(sanitized)

        return resolved

    def __process_error(self, output):
        """
        Process error event
        """
        logger.error("Processing error: {}".format(output))
        return SlackEvents.Error(
            error=output.get('error'),
            code=output.get('code'),
            msg=output.get('msg')
        )

    def __process_message(self, output):
        """
        Process message event
        """
        logger.info("Processing message: {}".format(output))
        text = output.get('text', '').strip().lower()
        if text:
            command = resolve(text, at=self.at_bot)
            if command:
                return SlackEvents.Message(
                    command=command,
                    channel=output.get('channel', self.default_channel),
                    user=output.get('user')
                )

    def __respond_with_error(self, output):
        """
        Respond with error
        """
        self.client.api_call(
            "chat.postMessage",
            channel="#choboi-errors",
            text="{}".format(output),
            as_user=True
        )

    def __respond_with_message(self, output):
        """
        Apply command action and reply with a message
        """
        response = output.command.action(
            *output.command.args,
            message=output
        )
        logging.info("Responding '{}'".format(response))
        self.client.api_call(
            "chat.postMessage",
            channel=output.channel,
            text=response,
            as_user=True
        )
