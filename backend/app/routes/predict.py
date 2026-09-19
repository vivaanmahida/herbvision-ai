"""POST /api/predict — Herb image classification endpoint."""
import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.classifier import classify_image
from app.models.gradcam import generate_gradcam, get_heatmap_explanation

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/predict")
@limiter.limit("20/minute")
async def predict_herb(request: Request, file: UploadFile = File(...)):
    # Validate content type
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{content_type}'. Please upload JPG, PNG, or WEBP images."
        )

    # Read and validate size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Image file too large. Maximum allowed size is 10 MB."
        )
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Classify
    try:
        result = classify_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

    # Generate Grad-CAM heatmap
    try:
        gradcam_image = generate_gradcam(image_bytes, result["herb_name"])
        heatmap_explanation = get_heatmap_explanation(result["herb_name"])
    except Exception as e:
        print(f"Grad-CAM error: {e}")
        gradcam_image = ""
        heatmap_explanation = "Heatmap visualization unavailable."

    return JSONResponse({
        "herb_name": result["herb_name"],
        "herb_id": result["herb_id"],
        "confidence": result["confidence"],
        "top5": result["top5"],
        "gradcam_image": gradcam_image,
        "heatmap_explanation": heatmap_explanation,
        "disclaimer": "This prediction is for educational purposes only. Consult an Ayurvedic expert for verification.",
    })
