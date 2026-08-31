from pydantic import BaseModel

class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str

class LoginPayload(BaseModel):
    email: str
    password: str