from pydantic import BaseModel, field_validator
from app.utils.hashid import encode_id

class Permission(BaseModel):
    name:str

class PermissionResponse(Permission):
    id: int
    name:str
    status: str


    @field_validator('id')
    @classmethod
    def enc_id(enc, v):
        return encode_id(v)

    @field_validator('name')
    @classmethod
    def clean_name(clv, v):
        return v.strip()

    class Config:
        from_attributes = True