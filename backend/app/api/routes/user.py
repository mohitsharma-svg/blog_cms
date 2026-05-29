from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse, AssignRoleRequest
from app.repositories import user_repository
from app.services import user_service
from app.core.permissions import require_permission

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.create"))
):
    return user_service.create_user(db, user)


@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.view"))
):
    return user_repository.get_all(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.view"))
):
    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/update/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.update"))
):
    return user_service.update_user(db, user_id, user_data)

@router.get("/status/{user_id}", response_model=UserResponse)
def change_status(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.toggle_status"))
):
    return user_service.toggle_status(db, user_id)

@router.post("/assign_role/{user_id}", response_model=UserResponse)
def assign_role(
    user_id: str,
    payload: AssignRoleRequest,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.assign_role"))
):
    return user_service.assign_role(db, user_id, payload.role_ids)

@router.delete("/delete/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("user.delete"))
):
    user_service.delete_user(db, user_id)
    return {"message": "User deleted successfully"}