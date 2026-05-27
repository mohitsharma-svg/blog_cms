from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base


class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)

    label = Column(String(100), nullable=False)
    href = Column(String(100), nullable=False)
    sort_order = Column(Integer, default=0)
    icon = Column(String(50), nullable=True)
    parent_id = Column(Integer, nullable=True)
    type = Column(String(20), default="page")

    is_active = Column(Boolean, default=True)