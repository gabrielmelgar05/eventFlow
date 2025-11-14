# schemas/user.py

from pydantic import BaseModel, EmailStr

class UserSchema(BaseModel):
    id: int
    name: str
    email: EmailStr
