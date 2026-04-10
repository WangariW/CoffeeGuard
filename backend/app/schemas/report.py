from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .geojson import PointGeometry

class ReportBase(BaseModel):
    disease: str
    confidence: float
    symptoms: Optional[str] = None
    treatment: Optional[str] = None
    location: PointGeometry
    county: str
    severity: str

class ReportCreate(ReportBase):
    pass


class ReportResponse(ReportBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True