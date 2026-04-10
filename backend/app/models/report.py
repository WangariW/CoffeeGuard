from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.core.database import Base

class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    disease = Column(String, nullable=False) 
    confidence = Column(Float, nullable=False)
    symptoms = Column(String, nullable=True)
    treatment = Column(String, nullable=True)
    
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    
    county = Column(String, index=True, nullable=False)
    severity = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", backref="reports")