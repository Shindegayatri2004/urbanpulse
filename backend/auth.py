"""
UrbanPulse - Authentication Module (JWT + SQLite)
"""

import sqlite3
import hashlib
import os
import time
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import jwt

SECRET_KEY = os.getenv("JWT_SECRET", "urbanpulse-secret-key-2024-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "users.db")

# ─── DB Setup ─────────────────────────────────────────────────────────────────

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


init_db()

# ─── Helpers ──────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_token(data: dict, expires_delta: Optional[timedelta] = None):
    payload = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ─── Schemas ──────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post("/signup")
def signup(req: SignupRequest):
    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE email=?", (req.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    pw_hash = hash_password(req.password)
    created_at = datetime.utcnow().isoformat()
    conn.execute(
        "INSERT INTO users (name, email, password_hash, created_at) VALUES (?,?,?,?)",
        (req.name, req.email, pw_hash, created_at),
    )
    conn.commit()
    conn.close()
    return {"message": "Account created successfully"}


@router.post("/login", response_model=LoginResponse)
def login(form: OAuth2PasswordRequestForm = Depends()):
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email=?", (form.username,)
    ).fetchone()
    conn.close()

    if not user or user["password_hash"] != hash_password(form.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({"sub": str(user["id"]), "email": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"],
        },
    }


@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    conn = get_db()
    user = conn.execute(
        "SELECT id, name, email, created_at FROM users WHERE id=?", (int(payload["sub"]),)
    ).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)
