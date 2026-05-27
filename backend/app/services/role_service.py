from fastapi import HTTPException, status
from sqlalchemy import delete
from app.models.role import Role
from app.models.permission import Permission
from app.repositories import role_repository
from app.models.role_permissions import role_permissions
from app.utils.validation import clean_text
from app.utils.hashid import decode_id

def _get_or_404(db, role_id: str):
    decoded_id = decode_id(role_id)
    role = role_repository.get_by_id(db, decoded_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


def get_all_roles(db):
    return role_repository.get_all(db)

def get_role(db, role_id: str):
    return _get_or_404(db, role_id)


def create_role(db, data):
    try:
        print(data)

        # 1. clean input
        name = clean_text(data.name)

        # 2. duplicate check
        existing_role = db.query(Role).filter(Role.name == name).first()
        if existing_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role name already exists"
            )

        # 3. create role
        role = Role(name=name, status="active")
        db.add(role)
        db.flush()

        # 4. if no permissions
        if not data.permissions:
            db.commit()
            db.refresh(role)
            return role

        # 5. decode hashids (IMPORTANT)
        decoded_permission_ids = [
            decode_id(pid) for pid in data.permissions
        ]

        # 6. fetch permissions
        permissions = (
            db.query(Permission)
            .filter(Permission.id.in_(decoded_permission_ids))
            .all()
        )

        # 7. validate permissions
        found_ids = {p.id for p in permissions}
        missing_ids = set(decoded_permission_ids) - found_ids

        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid permission ids: {list(missing_ids)}"
            )

        # 8. insert pivot table
        db.execute(
            role_permissions.insert(),
            [
                {
                    "role_id": role.id,
                    "permission_id": p.id
                }
                for p in permissions
            ]
        )

        # 9. commit
        db.commit()
        db.refresh(role)

        return role

    except Exception:
        db.rollback()
        raise

def update_role(db, role_id: str, data):
    try:
        role = _get_or_404(db, role_id)

        if data.name:
            role.name = clean_text(data.name)

        existing = (
            db.query(Role)
            .filter(Role.name == role.name, Role.id != role.id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role name already exists"
            )

        decoded_permission_ids = [
            decode_id(pid) for pid in (data.permissions or [])
        ]

        permissions = []
        if decoded_permission_ids:
            permissions = (
                db.query(Permission)
                .filter(Permission.id.in_(decoded_permission_ids))
                .all()
            )

            found_ids = {p.id for p in permissions}
            missing_ids = set(decoded_permission_ids) - found_ids

            if missing_ids:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid permission ids: {list(missing_ids)}"
                )

        # 6. update role
        db.add(role)
        db.flush()

        # 7. remove old permissions
        db.execute(
            delete(role_permissions).where(
                role_permissions.c.role_id == role.id
            )
        )

        # 8. insert new permissions
        if permissions:
            db.execute(
                role_permissions.insert(),
                [
                    {
                        "role_id": role.id,
                        "permission_id": p.id
                    }
                    for p in permissions
                ]
            )

        # 9. commit
        db.commit()
        db.refresh(role)

        return role

    except Exception:
        db.rollback()
        raise


def delete_role(db, role_id: str):
    role = _get_or_404(db, role_id)
    return role_repository.delete(db, role)


def toggle_status(db, role_id: str):
    role = _get_or_404(db, role_id)
    role.status = (
        "inactive" if role.status == "active" else "active"
    )
    db.commit()
    db.refresh(role)

    return role