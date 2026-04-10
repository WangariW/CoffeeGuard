from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Settings
    PORT: int = 5000
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Security
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # External Services
    AI_SERVICE_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"

# Instantiate it so we can import 'settings' anywhere in the app
settings = Settings()