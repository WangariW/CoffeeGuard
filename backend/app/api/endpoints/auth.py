from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, generate_otp
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import OTPRequest, OTPVerify, Token

router = APIRouter()

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}

@router.post("/request-otp")
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    # 1. Look up the user by email
    user = db.query(User).filter(User.email == payload.email).first()
    
    # 2. If they don't exist, create a new record (Auto-Registration)
    if not user:
        user = User(email=payload.email)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # 3. Generate OTP and set expiration (e.g., 5 minutes from now)
    otp = generate_otp()
    user.current_otp = otp
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    db.commit()
    
    # 4. Print to terminal (Replacing the need for an email service during dev)
    print(f"\n{'='*40}\n🔒 LOGIN OTP FOR {user.email}: {otp}\n{'='*40}\n")
    
    return {"message": "OTP generated. Check your terminal."}

@router.post("/verify-otp", response_model=Token)
def verify_otp(payload: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    
    # 1. Validate User and OTP existence
    if not user or not user.current_otp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid request")
    
    # 2. Check if OTP matches
    if user.current_otp != payload.otp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect OTP")
    
    # 3. Check if OTP is expired 
    if user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="OTP has expired")
    
    # 4. Success! Clear the OTP fields so it can't be reused
    user.current_otp = None
    user.otp_expires_at = None
    db.commit()
    
    # 5. Generate the JWT token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}