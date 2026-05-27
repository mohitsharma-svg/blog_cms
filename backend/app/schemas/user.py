from pydantic import BaseModel, EmailStr, field_validator
from app.utils.hashid import encode_id
from typing import List


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AssignRoleRequest(BaseModel):
    role_ids: List[str]


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class RoleResponse(BaseModel):
    id: int
    name: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    status: str
    roles: List[RoleResponse]

    @field_validator('id')
    @classmethod
    def enc_id(enc, v):
        return encode_id(v)

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password_hash: str

class UserUpdate(BaseModel):
    name: str
    email: EmailStr