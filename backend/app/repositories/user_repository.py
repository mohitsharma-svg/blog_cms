from sqlalchemy.orm import Session
from app.models.user import User
from sqlalchemy.orm import joinedload
from app.utils.hashid import decode_id


def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_by_id(db: Session, user_id: str):
    decoded_user_id = decode_id(user_id)
    print(decoded_user_id)
    return db.query(User).filter(User.id == decoded_user_id).first()


def get_all(db: Session):
    return (
        db.query(User)
        .options(joinedload(User.roles))
        .all()
    )


def add(db: Session, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete(db: Session, user: User):
    db.delete(user)
    db.commit()