from pydantic import BaseModel, EmailStr
from typing import Optional, Tuple

# Base properties 
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    county: Optional[str] = None

# What we return to the frontend (includes the DB ID, but HIDES the OTP fields)
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True  # This tells Pydantic to read our SQLAlchemy database models



class UserUpdate(BaseModel):
    name: Optional[str] = None
    county: Optional[str] = None
    # accept a simple [lng, lat] array from the frontend to make updates easy
    location: Optional[Tuple[float, float]] = None