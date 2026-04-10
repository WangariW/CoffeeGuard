from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.elements import WKTElement

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.report import DiseaseReport
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter()

@router.post("/create", response_model=ReportResponse)
def create_report(
    payload: ReportCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user) 
):
    # 1. Convert frontend GeoJSON [lng, lat] to Database WKT format
    lng, lat = payload.location.coordinates
    point_wkt = WKTElement(f"POINT({lng} {lat})", srid=4326)

    # 2. Build the database object
    new_report = DiseaseReport(
        user_id=current_user.id,
        disease=payload.disease,
        confidence=payload.confidence,
        symptoms=payload.symptoms,
        treatment=payload.treatment,
        location=point_wkt, # Save the spatial element
        county=payload.county,
        severity=payload.severity
    )
    
    # 3. Save to database
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report

@router.get("/user", response_model=list[ReportResponse])
def get_user_reports(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Fetch all reports belonging to the logged-in user
    reports = db.query(DiseaseReport).filter(DiseaseReport.user_id == current_user.id).all()
    return reports

@router.get("/nearby", response_model=list[ReportResponse])
def get_nearby_reports(
    lng: float = Query(..., description="Longitude"), 
    lat: float = Query(..., description="Latitude"), 
    radius: float = Query(20.0, description="Radius in kilometers"), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Create a WKT Point for the center of our search area
    search_point = WKTElement(f"POINT({lng} {lat})", srid=4326)
    
    # 2. Math translation: 1 degree of lat/lng is roughly 111 km at the equator.
    # Since SRID 4326 uses degrees, we convert the requested km radius into degrees.
    radius_degrees = radius / 111.0

    # 3. The Spatial Query: Find all reports within the radius
    nearby_reports = db.query(DiseaseReport).filter(
        func.ST_Distance(DiseaseReport.location, search_point) <= radius_degrees
    ).all()
    
    return nearby_reports

@router.get("/all", response_model=list[ReportResponse])
def get_all_reports(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Fetch all reports in the system, sorted by newest first
    reports = db.query(DiseaseReport).order_by(DiseaseReport.created_at.desc()).all()
    return reports

@router.get("/county/{name}", response_model=list[ReportResponse])
def get_reports_by_county(
    name: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Standard text filter, making it case-insensitive
    reports = db.query(DiseaseReport).filter(func.lower(DiseaseReport.county) == name.lower()).all()
    return reports