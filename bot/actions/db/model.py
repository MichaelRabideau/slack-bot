from sqlalchemy import Column, DateTime, String, Integer, Boolean, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


# deprecated
class Action(Base):
    __tablename__ = 'actions'

    id = Column(Integer, primary_key=True)
    command = Column(String)
    response = Column(String)
    mention = Column(Boolean)
    created_at = Column(DateTime, default=func.now())


class CustomResponse(Base):
    __tablename__ = 'custom_responses'

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    edited_by = Column(String)
    commands = relationship("CustomResponseCommand",
                            back_populates="custom_response")
    replies = relationship("CustomResponseReply",
                           back_populates="custom_response")


class CustomResponseCommand(Base):
    __tablename__ = 'custom_response_commands'

    id = Column(Integer, primary_key=True)
    command = Column(String)
    mention = Column(Boolean)
    exact = Column(Boolean)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    custom_response_id = Column(Integer, ForeignKey('custom_responses.id'))
    custom_response = relationship("CustomResponse", back_populates="commands")


class CustomResponseReply(Base):
    __tablename__ = 'custom_response_replies'

    id = Column(Integer, primary_key=True)
    reply = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    custom_response_id = Column(Integer, ForeignKey('custom_responses.id'))
    custom_response = relationship("CustomResponse", back_populates="replies")
