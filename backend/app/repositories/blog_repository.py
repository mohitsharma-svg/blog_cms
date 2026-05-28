from math import ceil

from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.category import Category
from app.models.user import User


# =========================
# PUBLIC ALL POSTS
# =========================
def get_all(
    db: Session,
    page: int = 1,
    limit: int = 10,
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
        .filter(Post.status == True)
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


# =========================
# PUBLIC SINGLE POST
# =========================
def get_by_slug(
    db: Session,
    slug: str,
):
    result = (
        db.query(
            Post,
            Category.name.label("category_name"),
            User.name.label("user_name"),
        )
        .join(Category, Post.category_id == Category.id)
        .join(User, Post.user_id == User.id)
        .filter(
            Post.slug == slug,
            Post.status == True
        )
        .first()
    )

    if not result:
        return None

    post, category_name, user_name = result

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