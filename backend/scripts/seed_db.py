import sys
import os
import random
from datetime import datetime, timedelta

# Add parent directory to path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine
from app.models.user import User
from app.models.report import DiseaseReport
from geoalchemy2.elements import WKTElement

def seed_db():
    print("Database seeding started...")
    
    db = SessionLocal()
    
    try:
        # Create users
        users_data = [
            {"email": "samuel@farmer.ke", "name": "Samuel Kamau", "county": "Nyeri", "lat": -0.42, "lng": 36.95},
            {"email": "mercy@farmer.ke", "name": "Mercy Wanjiku", "county": "Kiambu", "lat": -1.17, "lng": 36.83},
            {"email": "david@farmer.ke", "name": "David Mutua", "county": "Murang'a", "lat": -0.71, "lng": 37.15},
            {"email": "jane@farmer.ke", "name": "Jane Atieno", "county": "Kirinyaga", "lat": -0.5, "lng": 37.28},
            {"email": "admin@coffeeguard.ke", "name": "System Admin", "county": "Nairobi", "lat": -1.29, "lng": 36.82},
        ]
        
        db_users = []
        for ud in users_data:
            user = db.query(User).filter(User.email == ud["email"]).first()
            if not user:
                location = WKTElement(f"POINT({ud['lng']} {ud['lat']})", srid=4326)
                user = User(email=ud["email"], name=ud["name"], county=ud["county"], location=location)
                db.add(user)
                db.commit()
                db.refresh(user)
            db_users.append(user)

        # Diseases & Treatments
        diseases = [
            {"name": "Coffee Leaf Rust", "severity": "High", "symptoms": "Powdery orange spots", "treatment": "Copper-based fungicide applied immediately"},
            {"name": "Berry Disease", "severity": "High", "symptoms": "Dark sunken lesions on berries", "treatment": "Fungicide spray program and infected berry removal"},
            {"name": "Cercospora Leaf Spot", "severity": "Medium", "symptoms": "Brown spots with light centers", "treatment": "Improve shading and apply organic compost"},
            {"name": "Phoma Leaf Spot", "severity": "Medium", "symptoms": "Dark brown edge spots", "treatment": "Windbreaks and localized fungicide application"},
            {"name": "Healthy Plant", "severity": "Low", "symptoms": "No visible symptoms", "treatment": "Standard nutrition maintenance"}
        ]
        
        print("Creating reports...")
        counties = ["Nyeri", "Kiambu", "Murang'a", "Kirinyaga", "Embu"]
        # Center points mapping roughly to Kenyan counties
        county_coords = {
            "Nyeri": [36.95, -0.42], "Kiambu": [36.83, -1.17], "Murang'a": [37.15, -0.71],
            "Kirinyaga": [37.28, -0.5], "Embu": [37.45, -0.53]
        }
        
        # Don't seed if there's already >20 reports to prevent pollution on multiple runs
        existing_reports = db.query(DiseaseReport).count()
        if existing_reports > 0:
            print(f"Skipping seeding, database already has {existing_reports} reports.")
            return

        for i in range(30): # Generate 30 reports
            disease = random.choice(diseases)
            county = random.choice(counties)
            base_lng, base_lat = county_coords[county]
            
            # Slightly randomise coordinates within the county
            lng = base_lng + random.uniform(-0.1, 0.1)
            lat = base_lat + random.uniform(-0.1, 0.1)
            
            location = WKTElement(f"POINT({lng} {lat})", srid=4326)
            
            # Randomly associate with a user (except admin)
            farmer = random.choice(db_users[:4])
            
            report = DiseaseReport(
                user_id=farmer.id,
                disease=disease['name'],
                confidence=round(random.uniform(70.0, 99.9), 2),
                symptoms=disease['symptoms'],
                treatment=disease['treatment'],
                location=location,
                county=county,
                severity=disease['severity'],
            )
            db.add(report)
            
        db.commit()
        print("Successfully seeded database with 30 reports and 5 users!")
        
    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
