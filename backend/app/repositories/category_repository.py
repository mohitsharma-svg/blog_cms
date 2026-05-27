from sqlalchemy.orm import Session
from app.models.category import Category

def get_all(db: Session):
    return db.query(Category).all()

def get_by_id(db:Session, category_id:int):
    return db.query(Category).filter(Category.id == category_id).first()

def create(db:Session, category:Category):
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def delete(db:Session, category:Category):
    db.delete(category)
    db.commit()