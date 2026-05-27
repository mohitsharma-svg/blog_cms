from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime

from app.utils.hashid import encode_id


class PostBase(BaseModel):
    title: str
    category_id: str
    description: Optional[str] = None


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None


class PostResponse(BaseModel):
    id: str
    user_id: str
    category_id: str

    title: str
    description: Optional[str] = None

    image_url: Optional[str] = None

    slug: str
    status: str

    created_at: Optional[datetime] = None

    category_name: Optional[str] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True

    @field_validator(
        "id",
        "user_id",
        "category_id",
        mode="before"
    )
    @classmethod
    def encode_ids(cls, v):
        return encode_id(v) if v is not None else None

    @field_validator("title", mode="before")
    @classmethod
    def clean_title(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("description", mode="before")
    @classmethod
    def clean_desc(cls, v):
        return v.strip() if isinstance(v, str) else v


class PaginatedPostResponse(BaseModel):
    data: List[PostResponse]

    total: int
    page: int
    limit: int
    total_pages: int