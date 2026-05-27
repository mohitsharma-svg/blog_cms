# app/repositories/post_repository.py

from math import ceil

from sqlalchemy.orm import Session

from app.models.post import Post
from app.models.category import Category
from app.models.user import User


def get_all(
    db: Session,
    page: int = 1,
    limit: int = 10,
    user=None
):
    skip = (page - 1) * limit

    query = (
        db.query(
            Post,
            Category.name.label("category_name"),
            User.name.label("user_name"),
        )
        .join(Category, Post.category_id == Category.id)
        .join(User, Post.user_id == User.id)
    )

    # RBAC
    if user and not any(
        role.name == "admin"
        for role in user.roles
    ):
        query = query.filter(
            Post.user_id == user.id
        )

    total = query.count()

    results = (
        query
        .order_by(Post.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    posts = []

    for post, category_name, user_name in results:

        posts.append({
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "description": post.description,
            "image_url": post.image_url,
            "status": post.status,
            "created_at": (
                post.created_at.isoformat()
                if post.created_at
                else None
            ),
            "category_id": post.category_id,
            "category_name": category_name,
            "user_id": post.user_id,
            "user_name": user_name,
        })

    return {
        "data": posts,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (
            ceil(total / limit)
            if total > 0
            else 1
        ),
    }


def get_by_id_raw(
    db: Session,
    post_id: int
):
    return (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

def get_by_id(
    db: Session,
    post_id: int,
    user=None
):
    result = (
        db.query(
            Post,
            Category.name.label("category_name"),
            User.name.label("user_name"),
        )
        .join(Category, Post.category_id == Category.id)
        .join(User, Post.user_id == User.id)
        .filter(Post.id == post_id)
        .first()
    )

    if not result:
        return None

    post, category_name, user_name = result

    if user and not any(
        role.name == "admin"
        for role in user.roles
    ):
        if post.user_id != user.id:
            return None

    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "description": post.description,
        "image_url": post.image_url,
        "status": post.status,
        "created_at": (
            post.created_at.isoformat()
            if post.created_at
            else None
        ),
        "category_id": post.category_id,
        "category_name": category_name,
        "user_id": post.user_id,
        "user_name": user_name,
    }


def get_by_slug(
    db: Session,
    slug: str,
    user=None
):
    result = (
        db.query(
            Post,
            Category.name.label("category_name"),
            User.name.label("user_name"),
        )
        .join(Category, Post.category_id == Category.id)
        .join(User, Post.user_id == User.id)
        .filter(Post.slug == slug)
        .first()
    )

    if not result:
        return None

    post, category_name, user_name = result

    # RBAC
    if user and not any(
        role.name == "admin"
        for role in user.roles
    ):
        if post.user_id != user.id:
            return None

    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "description": post.description,
        "image_url": post.image_url,
        "status": post.status,
        "created_at": (
            post.created_at.isoformat()
            if post.created_at
            else None
        ),
        "category_id": post.category_id,
        "category_name": category_name,
        "user_id": post.user_id,
        "user_name": user_name,
    }


def create(
    db: Session,
    post: Post
):
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def delete(
    db: Session,
    post: Post
):
    db.delete(post)
    db.commit()