from flask_api import FlaskAPI
from flask_restful import Api


from . import db
from .health import Health
from .actions import Actions, SystemActions
from .schedules import Schedules

app = FlaskAPI(__name__)
api = Api(app)

db.initialize()

api.add_resource(Health, '/health')
api.add_resource(Actions, '/actions')
api.add_resource(Schedules, '/schedules')
api.add_resource(SystemActions, '/system/actions')
