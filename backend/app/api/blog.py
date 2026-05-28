from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.post import (
    PostResponse,
    PaginatedPostResponse
)
from app.services import blog_service

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


@router.get("/", response_model=PaginatedPostResponse)
def get_posts(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    return blog_service.get_posts(
        db,
        page,
        limit
    )


@router.get("/slug/{slug}", response_model=PostResponse)
def get_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    return blog_service.get_post_by_slug(
        db,
        slug
    )