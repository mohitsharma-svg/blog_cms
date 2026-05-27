from fastapi import HTTPException, status
from app.models.permission import Permission
from app.repositories import permission_repository
from app.utils.validation import clean_text
from app.utils.hashid import decode_id
from app.utils.master_helpers import permission_validator,format_permission_name

def _get_or_404(db, permission_id: str):
    decoded_id = decode_id(permission_id)
    permission = permission_repository.get_by_id(db, decoded_id)
    if not permission:
        raise HTTPException(status_code=404, detail="Permission not found")
    return permission


def get_all_permissions(db):
    permissions = permission_repository.get_all(db)
    for permission in permissions:
        parts = permission.name.split(".")
        if len(parts) == 2:
            module, action = parts
            if action == "assign_role":
                permission.name = f"{action}".upper()
            elif action == "status":
                permission.name = f"{module}_update_{action}".upper()
            else:
                permission.name = f"{action}_{module}".upper()
        else:
            permission.name = permission.name.upper()

    return permissions

def get_permission(db, permission_id: str):
    return _get_or_404(db, permission_id)


def create_permission(db, data):
    try:
        name = clean_text(data.name).lower()
        permission_validator(name)
        permission = Permission(
            name=name,
        )
        return permission_repository.create(db, permission)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create permission",
        )


def update_permission(db, permission_id: str, data):
    permission = _get_or_404(db, permission_id)
    name = clean_text(data.name).lower()
    permission_validator(name)
    permission.name = name
    db.commit()
    db.refresh(permission)
    return permission


def delete_permission(db, permission_id: str):
    permission = _get_or_404(db, permission_id)
    return permission_repository.delete(db, permission)


def toggle_status(db, permission_id: str):
    permission = _get_or_404(db, permission_id)
    permission.status = (
        "inactive" if permission.status == "active" else "active"
    )
    db.commit()
    db.refresh(permission)
    return permission