from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.database import engine, Base
from app.models import user, report
from app.api.endpoints import auth, reports, user, ai

def init_spatialite():
    with engine.connect() as conn:
        # Force autocommit because InitSpatialMetaData executes many internal DDL statements
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        
        # Check if the SpatiaLite system catalog already exists
        check = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='spatial_ref_sys'")).fetchone()
        
        if not check:
            print("Bootstrapping SpatiaLite system catalog. This might take a few seconds...")
            conn.execute(text("SELECT InitSpatialMetaData(1);"))
            print("SpatiaLite initialized successfully.")

# 1. Bootstrap the spatial metadata
init_spatialite()

# 2. Map the ORM tables (Users, DiseaseReports)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CoffeeGuard API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# all routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(reports.router, prefix="/api/reports", tags=["Disease Reports"])
app.include_router(user.router, prefix="/api/user", tags=["User Profile"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Processing"])

@app.get("/")
def read_root():
    return {"message": "CoffeeGuard Backend is running"}