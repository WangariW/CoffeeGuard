from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
from pathlib import Path
from datetime import datetime
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="CoffeeGuard AI Service",
    description="AI-powered coffee disease detection API",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
MODEL_PATH = Path('models/coffee_disease_model.h5')
CLASS_NAMES = ['cerscospora', 'healthy', 'leaf_miner', 'phoma', 'rust']

# Disease information database
DISEASE_INFO = {
    'rust': {
        'scientific_name': 'Hemileia vastatrix',
        'common_name': 'Coffee Leaf Rust',
        'severity': 'High',
        'symptoms': 'Powdery orange spots on the underside of leaves',
        'treatment': 'Apply copper-based fungicide, prune affected branches, improve air circulation',
        'risk_level': 'HIGH'
    },
    'cerscospora': {
        'scientific_name': 'Cercospora coffeicola',
        'common_name': 'Cerscospora Leaf Spot',
        'severity': 'Medium',
        'symptoms': 'Brown leaf spots with yellow halos',
        'treatment': 'Fungicide application, remove infected leaves, ensure proper drainage',
        'risk_level': 'MEDIUM'
    },
    'phoma': {
        'scientific_name': 'Phoma spp.',
        'common_name': 'Phoma Leaf Spot',
        'severity': 'Medium',
        'symptoms': 'Dark brown to black spots on leaves',
        'treatment': 'Copper-based sprays, improve plant nutrition, reduce humidity',
        'risk_level': 'MEDIUM'
    },
    'leaf_miner': {
        'scientific_name': 'Leucoptera coffeella',
        'common_name': 'Coffee Leaf Miner',
        'severity': 'Medium',
        'symptoms': 'Serpentine mines and blotches on leaves',
        'treatment': 'Biological control with parasitic wasps, insecticide if severe',
        'risk_level': 'MEDIUM'
    },
    'healthy': {
        'scientific_name': None,
        'common_name': 'Healthy Plant',
        'severity': 'None',
        'symptoms': 'No disease symptoms detected',
        'treatment': 'Continue regular monitoring and preventive care',
        'risk_level': 'LOW'
    }
}

print(" Loading AI model...")
try:
    model = keras.models.load_model(MODEL_PATH)
    print(f" Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f" Failed to load model: {e}")
    model = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "CoffeeGuard AI Service",
        "status": "online",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH),
        "supported_classes": CLASS_NAMES,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Predict coffee disease from uploaded image
    
    Args:
        file: Uploaded image file (JPG, PNG)
        
    Returns:
        JSON with prediction results
    """
    
    # Check if model is loaded
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize and normalize
        image = image.resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        predicted_disease = CLASS_NAMES[predicted_idx]
        
        # Get disease information
        disease_data = DISEASE_INFO.get(predicted_disease, {})
        
        # Build response
        result = {
            "success": True,
            "prediction": {
                "disease": predicted_disease,
                "confidence": round(confidence * 100, 2),
                "scientific_name": disease_data.get('scientific_name'),
                "common_name": disease_data.get('common_name'),
                "severity": disease_data.get('severity'),
                "risk_level": disease_data.get('risk_level')
            },
            "diagnosis": {
                "symptoms": disease_data.get('symptoms'),
                "treatment": disease_data.get('treatment')
            },
            "all_probabilities": {
                CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
                for i in range(len(CLASS_NAMES))
            },
            "timestamp": datetime.now().isoformat(),
            "image_info": {
                "filename": file.filename,
                "size": len(contents)
            }
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/diseases")
async def get_diseases():
    """Get information about all supported diseases"""
    return {
        "supported_diseases": CLASS_NAMES,
        "disease_info": DISEASE_INFO
    }

if __name__ == "__main__":
    print("\n" + "="*60)
    print(" CoffeeGuard AI Service")
    print("="*60)
    print(f" API URL: http://localhost:8000")
    print(f" API Docs: http://localhost:8000/docs")
    print(f" Health Check: http://localhost:8000/health")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
    