from flask_restful import Resource

from bot import scheduler

from . import jwt


class Schedules(Resource):

    @jwt.authorize
    def get(self, user):
        available_schedules = []

        for event in scheduler.events:
            available_schedules.append({
                'name': event.name,
                'channel': event.channel,
                'action': 'function'
            })

        return {'data': available_schedules}
