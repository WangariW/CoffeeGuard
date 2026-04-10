from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.get("/count")
def get_user_count(db: Session = Depends(get_db)):
    count = db.query(User).count()
    return {"count": count}

# GET /api/user/profile 
@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# PUT /api/user/profile 
@router.put("/profile", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if payload.name:
        current_user.name = payload.name
    if payload.county:
        current_user.county = payload.county
    if payload.location:
        # Convert the [lng, lat] array into the SpatiaLite WKT format
        lng, lat = payload.location
        current_user.location = WKTElement(f"POINT({lng} {lat})", srid=4326)

    db.commit()
    db.refresh(current_user)
    
    return current_user