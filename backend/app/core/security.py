import jwt
import random
from datetime import datetime, timedelta, timezone
from app.core.config import settings

ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    # Make a copy of the data so  the original dictionary is not mutated
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default expiration from .env
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add the expiration time to the payload under the standard 'exp' claim
    to_encode.update({"exp": expire})
    
    # Sign the JWT using the secret key
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def generate_otp() -> str:
    # Generates a random 6-digit string, e.g., "048291"
    return f"{random.randint(0, 999999):06d}"