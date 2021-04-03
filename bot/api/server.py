from flask_api import FlaskAPI

from bot import resolver
from bot import scheduler
from bot.api import jwt

app = FlaskAPI(__name__)


@app.route('/actions', )
@jwt.authorize
def actions(user):
    available_actions = []

    for cmd in resolver.global_commands:
        available_actions.append({
            'requireMention': False,
            'editable': False,
            'command': cmd.pattern,
            'response': 'function',
        })

    for cmd in resolver.mention_commands:
        available_actions.append({
            'requireMention': True,
            'editable': False,
            'command': cmd.pattern,
            'response': 'function',
        })

    return {'data': available_actions}


@app.route('/schedules', )
@jwt.authorize
def schedules(user):
    available_schedules = []

    for event in scheduler.events:
        available_schedules.append({
            'name': event.name,
            'channel': event.channel,
            'action': 'function'
        })

    return {'data': available_schedules}
