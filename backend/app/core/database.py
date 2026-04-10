import sqlite3
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
import platform

SQLALCHEMY_DATABASE_URL = "sqlite:///./coffeeguard.db"

# set check_same_thread=False for SQLite in FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# event listener that loads SpatiaLite into SQLite.
@event.listens_for(engine, "connect")
def load_spatialite(dbapi_conn, connection_record):
    dbapi_conn.enable_load_extension(True)
    
    system = platform.system()
    try:
        if system == "Darwin":  # macOS
            # Homebrew usually puts it here
            dbapi_conn.execute('SELECT load_extension("mod_spatialite")')
        elif system == "Windows":
            # Expects mod_spatialite.dll to be in the PATH or project root
            dbapi_conn.execute('SELECT load_extension("mod_spatialite.dll")')
        else:  # Linux / WSL
            dbapi_conn.execute('SELECT load_extension("mod_spatialite")')
    except Exception as e:
        print(f"FAILED TO LOAD SPATIALITE: {e}")
        
    dbapi_conn.enable_load_extension(False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All models will inherit from this Base
Base = declarative_base()

# Dependency to yield database sessions for our API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()