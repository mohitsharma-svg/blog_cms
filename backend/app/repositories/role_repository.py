from sqlalchemy.orm import Session
from app.models.role import Role

def get_all(db: Session):
    return db.query(Role).order_by(Role.id.desc()).all()

def get_by_id(db:Session, role_id:int):
    return db.query(Role).filter(Role.id == role_id).first()

def create(db:Session, role:Role):
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def delete(db:Session, role:Role):
    db.delete(role)
    db.commit()