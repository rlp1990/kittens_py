from pydantic import BaseModel
from typing import Optional

class KittenCreate(BaseModel):
    name: str
    age: int
    description: str
    image_url: Optional[str] = None

class KittenUpdate(BaseModel):
    name: Optional[str]
    age: Optional[int]
    description: Optional[str]
    image_url: Optional[str] = None
