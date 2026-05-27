from pydantic import BaseModel, field_validator, Field
from app.utils.hashid import encode_id
from typing import List

class Role(BaseModel):
    name:str
    
class RoleCreate(BaseModel):
    name: str
    permissions: list[str] = Field(default_factory=list)

class RoleUpdate(BaseModel):
    name: str
    permissions: list[str] = Field(default_factory=list)

class PermissionResponse(BaseModel):
    id:int
    name:str

    @field_validator('id')
    @classmethod
    def enc_id(enc, v):
        return encode_id(v)

class RoleResponse(Role):
    id: int
    name:str
    status: str
    permissions: List[PermissionResponse] = []


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