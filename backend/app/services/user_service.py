from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password
from app.repositories import user_repository
from app.models.user_roles import user_roles
from sqlalchemy import insert, delete
from app.utils.hashid import decode_id


def create_user(db, user_data):

    existing = user_repository.get_by_email(db, user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password_hash)
    )

    return user_repository.add(db, new_user)


def update_user(db, user_id, user_data):

    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = user_data.name
    user.email = user_data.email

    db.commit()
    db.refresh(user)

    return user


def toggle_status(db, user_id):

    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "inactive" if user.status == "active" else "active"

    db.commit()
    db.refresh(user)

    return user


def assign_role(db, user_id: str, role_ids: list[str]):
    user_id = decode_id(user_id)

    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decoded_role_ids = [decode_id(rid) for rid in role_ids]

    # ------------------------
    # Delete old roles
    # ------------------------
    db.execute(
        delete(user_roles).where(user_roles.c.user_id == user_id)
    )

    # ------------------------
    # Insert new roles
    # ------------------------
    if decoded_role_ids:
        db.execute(
            insert(user_roles),
            [
                {"user_id": user_id, "role_id": role_id}
                for role_id in decoded_role_ids
            ]
        )

    db.commit()
    db.refresh(user)

    return user


def delete_user(db, user_id):

    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_repository.delete(db, user)