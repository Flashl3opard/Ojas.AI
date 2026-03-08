from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole


class AuthUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
