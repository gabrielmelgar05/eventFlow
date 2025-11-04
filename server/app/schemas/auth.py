from pydantic import BaseModel, EmailStr

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    token: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
