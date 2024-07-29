from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models import Kitten
from app.schemas import KittenCreate, KittenUpdate
from app.crud import MongoDB
import os
from uuid import uuid4
from fastapi.logger import logger

router = APIRouter()

db = MongoDB(os.getenv("MONGODB_URL"), "kittens_db")

@router.post("/kittens/", response_model=Kitten)
async def create_kitten(kitten: KittenCreate):
    try:
        kitten_id = await db.create_kitten(Kitten(**kitten.dict()))
        return await db.get_kitten(kitten_id)
    except Exception as e:
        logger.error(f"Error creating kitten: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/kittens/{kitten_id}", response_model=Kitten)
async def read_kitten(kitten_id: str):
    kitten = await db.get_kitten(kitten_id)
    if kitten is None:
        raise HTTPException(status_code=404, detail="Kitten not found")
    return kitten

@router.put("/kittens/{kitten_id}", response_model=Kitten)
async def update_kitten(kitten_id: str, kitten: KittenUpdate):
  try:
    updated_kitten = await db.update_kitten(kitten_id, Kitten(**kitten.dict(exclude_unset=True)))
    if updated_kitten is None:
        raise HTTPException(status_code=404, detail="Kitten not found")
    return updated_kitten
  except Exception as e:
    logger.error(f"Error updating kitten: {str(e)}")
    raise HTTPException(status_code=500, detail=str(e))

@router.delete("/kittens/{kitten_id}")
async def delete_kitten(kitten_id: str):
    await db.delete_kitten(kitten_id)
    return {"message": "Kitten deleted"}

@router.get("/kittens/", response_model=list[Kitten])
async def list_kittens():
    return await db.list_kittens()

@router.post("/upload_image/")
async def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid4()}.jpg"
    file_location = f"static/{filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"image_url": file_location}
