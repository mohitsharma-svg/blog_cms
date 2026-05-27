import os
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.post import Post
from app.repositories import post_repository
from app.utils.slug import generate_unique_slug
from app.utils.validation import clean_text
from app.utils.hashid import decode_id

UPLOAD_DIR = "uploads"


def _get_or_404(db: Session, post_id: str):
    decoded_id = decode_id(post_id)

    post = post_repository.get_by_id_raw(db, decoded_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post


def get_posts(
    db: Session,
    page: int = 1,
    limit: int = 10,
    user=None
):
    return post_repository.get_all(
        db=db,
        page=page,
        limit=limit,
        user=user
    )


def get_post(
    db: Session,
    post_id: str,
    user=None
):
    post = _get_or_404(db, post_id)

    is_admin = user and any(
        role.name == "admin"
        for role in user.roles
    )

    if user and not is_admin:
        if post.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="Not allowed"
            )

    return post_repository.get_by_id(
        db,
        post.id,
        user
    )


def get_post_by_slug(
    db: Session,
    slug: str,
    user=None
):
    post = post_repository.get_by_slug(
        db,
        slug,
        user
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post


def create_post(
    db: Session,
    title,
    description,
    category_id,
    image,
    user_id
):
    category_id = decode_id(category_id)

    title = clean_text(title)

    slug = generate_unique_slug(
        db,
        Post,
        title
    )

    image_url = _save_image(image)

    post = Post(
        user_id=user_id,
        category_id=category_id,
        title=title,
        slug=slug,
        description=description.strip() if description else None,
        image_url=image_url,
    )

    return post_repository.create(db, post)


def update_post(
    db: Session,
    post_id,
    title,
    description,
    category_id,
    image,
    user
):
    post = _get_or_404(db, post_id)

    is_admin = any(
        role.name == "admin"
        for role in user.roles
    )

    if not is_admin and post.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    if title:
        title = clean_text(title)

        post.title = title

        post.slug = generate_unique_slug(
            db,
            Post,
            title
        )

    if description is not None:
        post.description = (
            description.strip()
            if description.strip()
            else None
        )

    if category_id:
        post.category_id = decode_id(category_id)

    if image:
        post.image_url = _replace_image(
            post.image_url,
            image
        )

    db.commit()
    db.refresh(post)

    return post_repository.get_by_id(
        db,
        post.id,
        user
    )


def delete_post(
    db: Session,
    post_id,
    user
):
    post = _get_or_404(db, post_id)

    is_admin = any(
        role.name == "admin"
        for role in user.roles
    )

    if not is_admin and post.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    if post.image_url and os.path.exists(post.image_url):
        try:
            os.remove(post.image_url)
        except Exception:
            pass

    post_repository.delete(db, post)

    return {
        "message": "Post deleted successfully"
    }


def toggle_status(
    db: Session,
    post_id: str,
    user
):
    post = _get_or_404(db, post_id)
    print(f"Posts: {post}")

    is_admin = any(
        role.name == "admin"
        for role in user.roles
    )

    if not is_admin and post.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    post.status = (
        "inactive"
        if post.status == "active"
        else "active"
    )

    db.commit()
    db.refresh(post)

    return post_repository.get_by_id(
    db,
    post.id,
    user
    )


def _save_image(image: UploadFile):

    if not image:
        return None

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = image.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{ext}"

    filepath = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(filepath, "wb") as file:
        file.write(image.file.read())

    return filepath


def _replace_image(
    old_path,
    image: UploadFile
):
    if old_path and os.path.exists(old_path):
        try:
            os.remove(old_path)
        except Exception:
            pass

    return _save_image(image)