from pydantic import BaseModel, EmailStr

# What the frontend sends to request a code
class OTPRequest(BaseModel):
    email: EmailStr  # Pydantic automatically checks if this is a valid email format!

# What the frontend sends to verify the code
class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

# What we send BACK to the frontend upon success
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"