from sqlalchemy import Column, Integer, String, DateTime
from geoalchemy2 import Geometry
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True) 
    email = Column(String, unique=True, index=True, nullable=False)
    county = Column(String, nullable=True)
    
    # Spatial column - SRID 4326 is the standard GPS coordinate system (WGS84)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True) 

    # Auth fields
    current_otp = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)