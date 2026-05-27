from fastapi import HTTPException

from app.models.category import Category
from app.repositories import category_repository
from app.utils.slug import generate_unique_slug
from app.utils.validation import clean_text
from app.utils.hashid import decode_id


def _get_or_404(db, category_id: str):
    decoded_id = decode_id(category_id)

    category = category_repository.get_by_id(db, decoded_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


def get_all_categories(db):
    return category_repository.get_all(db)


def get_category(db, category_id: str):
    return _get_or_404(db, category_id)


def create_category(db, data):

    name = clean_text(data.name)
    slug = generate_unique_slug(db, Category, name)

    category = Category(
        name=name,
        slug=slug,
        description=(data.description or "").strip() or None
    )

    return category_repository.create(db, category)


def update_category(db, category_id: str, data):

    category = _get_or_404(db, category_id)

    category.name = clean_text(data.name)
    category.slug = generate_unique_slug(db, Category, data.name)
    category.description = (data.description or "").strip() or None

    db.commit()
    db.refresh(category)

    return category


def delete_category(db, category_id: str):

    category = _get_or_404(db, category_id)

    category_repository.delete(db, category)


def toggle_status(db, category_id: str):

    category = _get_or_404(db, category_id)

    category.status = (
        "inactive" if category.status == "active" else "active"
    )

    db.commit()
    db.refresh(category)

    return category