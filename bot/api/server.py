from flask import request
from flask_api import FlaskAPI
import sqlalchemy
from sqlalchemy.orm import sessionmaker

from bot import resolver
from bot import scheduler
from bot import config
from bot.api import jwt
from bot.actions.db.model import Action

app = FlaskAPI(__name__)

db = sqlalchemy.create_engine(config.DATABASE_URL)


def list_actions():
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


def create_action(data):
    try:
        a = Action(
            command=data['command'],
            response=data['response'],
            mention=data['mention'],
        )
        session = sessionmaker(bind=db)()
        session.add(a)
        session.commit()
        return {'data': {'command': a.command, 'response': a.response, 'mention': a.mention}}, 201
    except sqlalchemy.exc.IntegrityError:
        return {'message': 'Command already exists'}, 400
    except Exception as e:
        print(e)
        return {'message': 'Unknown error'}, 500


@app.route('/health', methods=['GET'])
def health():
    return {'alive': 'ok'}, 200


@ app.route('/actions', methods=['GET', 'POST'])
@ jwt.authorize
def actions(user):
    if request.method == 'GET':
        return list_actions()
    try:
        return create_action(request.data)
    except Exception as e:
        print(e)


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
