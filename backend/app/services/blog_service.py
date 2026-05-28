import os
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.post import Post
from app.repositories import blog_repository


# =========================
# PUBLIC ALL BLOG POSTS
# =========================
def get_posts(
    db: Session,
    page: int = 1,
    limit: int = 10
):
    return blog_repository.get_all(
        db=db,
        page=page,
        limit=limit
    )

def get_post_by_slug(
    db: Session,
    slug: str,
):
    post = blog_repository.get_by_slug(
        db,
        slug
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post