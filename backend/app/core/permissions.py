from fastapi import Depends, HTTPException, status
from app.utils.jwt import get_current_user
from app.core.redis import get as get_cached_permissions


def build_permissions(user):
    return {
        p.name
        for r in user.roles
        for p in r.permissions
    }


def require_permission(permission: str):
    def wrapper(user=Depends(get_current_user)):

        if any(r.name == "admin" for r in user.roles):
            return user

        user_id = str(user.id)

        cached = get_cached_permissions(user_id)

        if cached is not None:
            allowed = permission in cached
        else:
            allowed = permission in build_permissions(user)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )

        return user

    return wrapper