from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.sqlite import JSON
from database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    username = Column(String)
    giving_skills = Column(String)
    wanted_skills = Column(String)
    location = Column(String)
    profile_picture = Column(String)
    availability = Column(String)
    profile_type = Column(String) 

class SkillExchangeRequest(Base):
    __tablename__ = "skill_requests"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"))
    to_user_id = Column(Integer, ForeignKey("users.id"))
    skill_offered = Column(String)
    skill_requested = Column(String)
    status = Column(String, default="pending")
    message = Column(String)

    from_user = relationship("User", foreign_keys=[from_user_id])
    to_user = relationship("User", foreign_keys=[to_user_id])
