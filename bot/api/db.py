import sqlalchemy

from bot import config

_db = None


def initialize():
    global _db
    _db = sqlalchemy.create_engine(config.DATABASE_URL)


def get_conn():
    return _db
