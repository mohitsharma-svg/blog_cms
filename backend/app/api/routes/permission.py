from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.permission import Permission, PermissionResponse
from app.services import permission_service

router = APIRouter(prefix="/permissions", tags=["Permission"])


@router.get('/', response_model=list[PermissionResponse])
def get_permissions(db:Session = Depends(get_db)):
    return permission_service.get_all_permissions(db)


@router.get("/{permission_id}", response_model=PermissionResponse)
def get_permission(permission_id: str, db: Session = Depends(get_db)):
    return permission_service.get_permission(db, permission_id)


@router.post("/create", response_model=PermissionResponse)
def create_permission(data: Permission, db: Session = Depends(get_db)):
    return permission_service.create_permission(db, data)


@router.put("/update/{permission_id}", response_model=PermissionResponse)
def update_permission(permission_id: str, data: Permission, db: Session = Depends(get_db)):
    return permission_service.update_permission(db, permission_id, data)


@router.delete("/delete/{permission_id}")
def delete_permission(permission_id: str, db: Session = Depends(get_db)):
    permission_service.delete_permission(db, permission_id)
    return {"message": "Permission deleted successfully"}


@router.get("/status/{permission_id}", response_model=PermissionResponse)
def change_status(permission_id: str, db: Session = Depends(get_db)):
    return permission_service.toggle_status(db, permission_id)
