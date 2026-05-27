from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token, verify_password, decode_refresh_token

from app.utils.jwt import get_current_user
from app.models.user import User
from app.schemas.user import UserLogin
from app.models.menu import Menu
from app.models.permission import Permission

router = APIRouter(prefix="/auth", tags=["Auth"])


def singularize(word: str):
    irregular = {
        "people": "person",
        "men": "man",
        "women": "woman",
        "children": "child",
        "categories": "category",
    }

    if word in irregular:
        return irregular[word]

    if word.endswith("ies"):
        return word[:-3] + "y"

    if word.endswith(("sses", "shes", "ches", "xes", "zes")):
        return word[:-2]

    if word.endswith("s") and not word.endswith("ss"):
        return word[:-1]

    return word


def get_permission_from_href(href: str):
    resource = href.strip("/")

    if not resource:
        return None

    resource = resource.split("/")[-1]
    resource = singularize(resource)

    return f"{resource}.view"

@router.post("/login")
def login(
    data: UserLogin,
    response: Response,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == data.email).first()

    if (
        not user
        or not verify_password(data.password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User inactive"
        )

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 15,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

    return {"message": "Login successful"}


@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    roles = [role.name for role in current_user.roles]

    is_admin = "admin" in roles

    if is_admin:
        permissions = [
            perm.name
            for perm in db.query(Permission).all()
        ]
    else:
        permissions = list({
            perm.name
            for role in current_user.roles
            for perm in role.permissions
        })

    menus = (
        db.query(Menu)
        .filter(Menu.is_active == True)
        .order_by(Menu.sort_order)
        .all()
    )

    filtered_menu = []

    for menu in menus:
        if is_admin:
            filtered_menu.append({
                "id": menu.id,
                "label": menu.label,
                "href": menu.href,
                "sort_order": menu.sort_order,
                "is_active": menu.is_active,
            })
            continue

        required_permission = get_permission_from_href(menu.href)

        if menu.href == "/dashboard":
            required_permission = "dashboard.view"

        if required_permission in permissions:
            filtered_menu.append({
                "id": menu.id,
                "label": menu.label,
                "href": menu.href,
                "sort_order": menu.sort_order,
                "is_active": menu.is_active,
            })

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "status": current_user.status,
        "roles": roles,
        "permissions": permissions,
        "menu": filtered_menu,
    }

@router.post("/refresh")
def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("refresh_token")

    print("REFRESH COOKIE:", token)

    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")

    payload = decode_refresh_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("sub")

    try:
        user_id = int(user_id)
    except:
        raise HTTPException(status_code=401, detail="Invalid user id")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = create_access_token({"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        samesite="lax",
        secure=False, 
        max_age=60 * 15,
        path="/",
    )

    return {"message": "refreshed"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "logged out"}