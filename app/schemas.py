from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List

class Vaccination(BaseModel):
    type: str
    date: datetime

class KittenCreate(BaseModel):
    name: str
    age: int
    breed: str
    image_url: Optional[str] = None
    vaccinations: List[Vaccination] = []

class KittenUpdate(BaseModel):
    name: Optional[str]
    age: Optional[int]
    breed: Optional[str]
    image_url: Optional[str] = None
    vaccinations: Optional[List[Vaccination]]
