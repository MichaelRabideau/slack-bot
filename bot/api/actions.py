from flask import request
from flask_restful import Resource
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy_pagination import paginate

from bot import resolver
from bot.actions.db import model

from . import jwt
from .db import get_conn


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
            a = model.Action(
                command=data['command'].lower(),
                response=data['response'],
                mention=data['mention'],
            )
            session = sessionmaker(bind=get_conn())()
            session.add(a)
            session.commit()
            return {'data': {'command': a.command, 'response': a.response, 'mention': a.mention}}, 201
        except sqlalchemy.exc.IntegrityError:
            return {'message': 'Command already exists'}, 400
        except Exception as e:
            print(e)
            return {'message': 'Unknown error'}, 500

    @jwt.authorize
    def get(self, user):
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 25))
        session = sessionmaker(bind=get_conn())()
        page = paginate(session.query(model.Action), page, page_size)
        items = [{'command': x.command, 'response': x.response,
                  'mention': x.mention} for x in page.items]
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
