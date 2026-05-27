from sqlalchemy.orm import Session
from app.models.permission import Permission

def get_all(db: Session):
    return db.query(Permission).order_by(Permission.id.desc()).all()

def get_by_id(db:Session, permission_id:int):
    return db.query(Permission).filter(Permission.id == permission_id).first()

def create(db:Session, permission:Permission):
    db.add(permission)
    db.commit()
    db.refresh(permission)
    return permission

def delete(db:Session, permission:Permission):
    db.delete(permission)
    db.commit()