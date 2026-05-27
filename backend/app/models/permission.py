from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    status = Column(String(20), default="active", nullable=False)

    deleted_at = Column(DateTime, nullable=True)