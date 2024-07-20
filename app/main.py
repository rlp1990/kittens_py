from fastapi import FastAPI
from app.routes import router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(router)

if not os.path.exists('static'):
    os.makedirs('static')
