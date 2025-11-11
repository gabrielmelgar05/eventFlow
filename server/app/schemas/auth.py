from pydantic import BaseModel, EmailStr, Field

class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4)

class SignupInput(LoginInput):
    name: str = Field(min_length=2, max_length=120)

class TokenOut(BaseModel):
    token: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
