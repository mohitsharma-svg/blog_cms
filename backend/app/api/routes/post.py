from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.permissions import require_permission
from app.schemas.post import PostResponse, PaginatedPostResponse
from app.models.user import User
from app.services import post_service

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("/", response_model=PaginatedPostResponse)
def get_posts(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.view"))
):
    return post_service.get_posts(db, page, limit, user)

@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.view"))
):
    return post_service.get_post(db, post_id, user)


@router.get("/slug/{slug}", response_model=PostResponse)
def get_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.view"))
):
    return post_service.get_post_by_slug(db, slug, user)


@router.post("/create", response_model=PostResponse)
def create_post(
    title: str = Form(...),
    description: str = Form(None),
    category_id: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.create")), 
    # _perm: User = Depends(require_permission("post.create"))
):
    return post_service.create_post(
        db,
        title,
        description,
        category_id,
        image,
        user.id 
    )


# =========================
# UPDATE POST
# =========================
@router.put("/update/{post_id}", response_model=PostResponse)
def update_post(
    post_id: str,
    title: str = Form(None),
    description: str = Form(None),
    category_id: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.update"))
):
    return post_service.update_post(
        db,
        post_id,
        title,
        description,
        category_id,
        image,
        user
    )


# =========================
# DELETE POST
# =========================
@router.delete("/delete/{post_id}")
def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.delete"))
):
    post_service.delete_post(db, post_id, user)
    return {"message": "Post deleted successfully"}


@router.patch("/status/{post_id}", response_model=PostResponse)
def toggle_status(
    post_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("post.status"))
):
    return post_service.toggle_status(db, post_id, user)