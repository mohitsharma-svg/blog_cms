from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.utils.jwt import get_current_user

from app.models.user import User
from app.models.menu import Menu
from app.models.permission import Permission
from app.models.role import Role
from app.models.category import Category
from app.models.post import Post


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/dashboard_data")
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    roles = [role.name for role in current_user.roles]

    is_admin = "admin" in roles

    permissions = list({
        perm.name
        for role in current_user.roles
        for perm in role.permissions
    })

    cards = []

    if is_admin or "user.view" in permissions:

        total_users = db.query(
            func.count(User.id)
        ).scalar()

        active_users = (
            db.query(func.count(User.id))
            .filter(User.status == "active")
            .scalar()
        )

        inactive_users = (
            db.query(func.count(User.id))
            .filter(User.status == "inactive")
            .scalar()
        )

        cards.extend([
            {
                "title": "Total Users",
                "count": total_users,
                "link": "/users",
                "permission": "user.view",
            },
            {
                "title": "Active Users",
                "count": active_users,
                "link": "/users",
                "permission": "user.view",
            },
            {
                "title": "Inactive Users",
                "count": inactive_users,
                "link": "/users",
                "permission": "user.view",
            }
        ])

    if is_admin or "role.view" in permissions:

        total_roles = db.query(
            func.count(Role.id)
        ).scalar()

        cards.append({
            "title": "Roles",
            "count": total_roles,
            "link": "/roles",
            "permission": "role.view",
        })

    if is_admin or "permission.view" in permissions:

        total_permissions = db.query(
            func.count(Permission.id)
        ).scalar()

        cards.append({
            "title": "Permissions",
            "count": total_permissions,
            "link": "/permissions",
            "permission": "permission.view",
        })

    if is_admin or "menu.view" in permissions:

        total_menus = db.query(
            func.count(Menu.id)
        ).scalar()

        cards.append({
            "title": "Menus",
            "count": total_menus,
            "link": "/menus",
            "permission": "menu.view",
        })

    if is_admin or "category.view" in permissions:

        total_categories = db.query(
            func.count(Category.id)
        ).scalar()

        cards.append({
            "title": "Categories",
            "count": total_categories,
            "link": "/categories",
            "permission": "category.view",
        })

    if is_admin or "post.view" in permissions:

        total_posts = db.query(
            func.count(Post.id)
        ).scalar()

        published_posts = (
            db.query(func.count(Post.id))
            .filter(Post.status == "published")
            .scalar()
        )

        cards.extend([
            {
                "title": "Posts",
                "count": total_posts,
                "link": "/posts",
                "permission": "post.view",
            },
            {
                "title": "Published Posts",
                "count": published_posts,
                "link": "/posts",
                "permission": "post.view",
            },
        ])

    return cards