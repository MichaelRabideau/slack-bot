from flask import request
from flask_restful import Resource
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy_pagination import paginate

from bot import resolver
from bot.actions.db import model
from bot.remote import slack

from . import jwt
from .db import get_conn


def slack_id_from_auth0_id(uid):
    parts = uid.split('|')
    if len(parts) != 3:
        return ''
    return parts[-1].split('-')[-1]


class SystemActions(Resource):

    @jwt.authorize
    def get(self, user):
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


class Actions(Resource):

    @jwt.authorize
    def post(self, user):
        data = request.data
        try:
            session = sessionmaker(bind=get_conn())()
            cr = model.CustomResponse(
                edited_by=user['sub'],
            )
            session.add(cr)
            session.commit()

            for cmd in data['commands']:
                crc = model.CustomResponseCommand(
                    command=cmd['command'],
                    mention=cmd['mention'],
                    exact=cmd['exact'],
                    custom_response_id=cr.id,
                )
                session.add(crc)

            for reply in data['replies']:
                crr = model.CustomResponseReply(
                    reply=reply['reply'],
                    custom_response_id=cr.id,
                )
                session.add(crr)
            session.commit()
            return {'data': 'ok'}, 201
        except sqlalchemy.exc.IntegrityError:
            return {'message': 'Command already exists'}, 400
        except Exception as e:
            print(e)
            return {'message': 'Unknown error'}, 500
        finally:
            session.flush()

    @jwt.authorize
    def get(self, user):
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 25))
        session = sessionmaker(bind=get_conn())()
        page = paginate(session.query(model.CustomResponse), page, page_size)
        items = [{
            'id': x.id,
            'edited_by': slack.get_username_from_id(slack_id_from_auth0_id(x.edited_by)),
            'commands': [{
                'id': cmd.id,
                'command': cmd.command,
                'mention': cmd.mention,
                'exact': cmd.exact,
            } for cmd in x.commands],
            'replies': [{
                'id': reply.id,
                'reply': reply.reply,
            } for reply in x.replies]
        } for x in page.items]
        session.commit()
        return {
            'total': page.total,
            'pages': page.pages,
            'has_next': page.has_next,
            'has_previous': page.has_previous,
            'next_page': page.next_page,
            'previous_page': page.previous_page,
            'items': items,
        }, 200
