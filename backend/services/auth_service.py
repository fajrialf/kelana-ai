import bcrypt
from jose import jwt
import os
from datetime import datetime, timezone, timedelta
from models.userPayload import RegisterPayload, LoginPayload
from models.user import User
from databases import Sessionlocal
from fastapi import HTTPException

def hash_password(password: str):
    return bcrypt.hashpw(bytes(password, encoding="utf-8"),bcrypt.gensalt(8)).decode("utf-8")

def verify_password(password: str, hash: str) -> bool:
    return bcrypt.checkpw(
          bytes(password, encoding="utf-8"),
          bytes(hash, encoding="utf-8")
    )

def create_access_token(user: User) -> str:
    secret    = os.getenv("JWT_SECRET")
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    expire_minutes = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

    payload = {
        "sub": str(user.id),
        "name": user.name,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expire_minutes),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, secret, algorithm=algorithm)

def register(payload: RegisterPayload):
    if (payload.password != payload.confirm_password):
        raise HTTPException(400, detail="Passwords do not match")

    user= User(
        name= payload.name,
        email = payload.email,
        password_hash = hash_password(payload.password)
    )
    db = Sessionlocal()

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

def auth_login(payload: LoginPayload):
    db = Sessionlocal()
    user = db.query(User).filter(User.email == payload.email).first()
    db.close()
    if (user is None) or (not verify_password(payload.password, user.password_hash)):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": int(os.getenv("JWT_EXPIRE_MINUTES", "60")) * 60,
    }

def get_me(user_id: int):
    from models.trip import Trip
    db = Sessionlocal()
    user = db.query(User).filter(User.id == user_id).first()
    trips_generated = db.query(Trip).filter(Trip.user_id == user_id).count()
    db.close()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "name": user.name,
        "email": user.email,
        "trips_generated": trips_generated,
    }