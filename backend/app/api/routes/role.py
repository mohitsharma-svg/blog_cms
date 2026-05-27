from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.role import Role, RoleResponse, RoleCreate, RoleUpdate
from app.services import role_service

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get('/', response_model=list[RoleResponse])
def get_roles(db:Session = Depends(get_db)):
    return role_service.get_all_roles(db)


@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: str, db: Session = Depends(get_db)):
    return role_service.get_role(db, role_id)


@router.post("/create", response_model=RoleResponse)
def create_role(data: RoleCreate, db: Session = Depends(get_db)):
    return role_service.create_role(db, data)


@router.put("/update/{role_id}", response_model=RoleResponse)
def update_role(role_id: str, data: RoleUpdate, db: Session = Depends(get_db)):
    return role_service.update_role(db, role_id, data)


@router.delete("/delete/{role_id}")
def delete_role(role_id: str, db: Session = Depends(get_db)):
    role_service.delete_role(db, role_id)
    return {"message": "Role deleted successfully"}


@router.get("/status/{role_id}", response_model=RoleResponse)
def change_status(role_id: str, db: Session = Depends(get_db)):
    return role_service.toggle_status(db, role_id)
