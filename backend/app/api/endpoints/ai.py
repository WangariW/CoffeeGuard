from fastapi import APIRouter, UploadFile, File, HTTPException
import httpx

from app.core.config import settings

router = APIRouter()

# POST /api/ai/predict - Proxy to localhost:8000/predict 
@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    # use 'async with' to open a network client that won't block the server
    async with httpx.AsyncClient() as client:
        try:
            # 1. Read the image file the user uploaded
            file_content = await file.read()
            
            # 2. Package it exactly how the AI FastAPI server expects it
            files = {"file": (file.filename, file_content, file.content_type)}
            
            # 3. Send it to the AI Model and wait for the response
            response = await client.post(
                f"{settings.AI_SERVICE_URL}/predict",
                files=files,
                timeout=30.0 # Give the TensorFlow model up to 30 seconds to run
            )
            
            # 4. If the AI model crashes, this throws an error immediately
            response.raise_for_status() 
            
            # 5. Return the exact JSON (disease name and confidence) from the AI
            return response.json()
            
        except httpx.RequestError as exc:
            # This triggers if the AI server on port 8000 is turned off
            raise HTTPException(status_code=503, detail=f"AI Service offline: {exc}")
        except httpx.HTTPStatusError as exc:
            # This triggers if the AI model throws a 400 or 500 error
            raise HTTPException(status_code=exc.response.status_code, detail="AI processing failed")