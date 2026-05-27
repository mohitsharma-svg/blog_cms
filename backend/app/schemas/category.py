from pydantic import BaseModel, field_validator
from app.utils.hashid import encode_id


class CategoryBase(BaseModel):
    name: str
    description:str


class CategoryCreate(CategoryBase):
    name:str
    description:str


class CategoryUpdate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    name:str
    slug:str
    description:str
    status: str


    @field_validator('id')
    @classmethod
    def enc_id(enc, v):
        return encode_id(v)

    @field_validator('name')
    @classmethod
    def clean_name(clv, v):
        return v.strip()
    
    @field_validator('description')
    @classmethod
    def clean_desc(clv, v):
        return v.strip() if v else v

    class Config:
        from_attributes = True