from sqlalchemy import Column, DateTime, String, Integer, Boolean, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Action(Base):
    __tablename__ = 'actions'

    id = Column(Integer, primary_key=True)
    command = Column(String, unique=True)
    response = Column(String)
    mention = Column(Boolean)
    created_at = Column(DateTime, default=func.now())
