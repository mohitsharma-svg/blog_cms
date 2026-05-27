import re
import unicodedata


def generate_slug(text: str) -> str:
    text = text.strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text


def generate_unique_slug(db, model, name: str, slug_field: str = "slug"):
    base_slug = generate_slug(name)
    slug = base_slug
    counter = 1
    while db.query(model).filter(getattr(model, slug_field) == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug