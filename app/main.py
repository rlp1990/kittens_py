from fastapi import FastAPI
from app.routes import router
import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI()

app.include_router(router)

if not os.path.exists('/static'):
    os.makedirs('/static')

app.mount("/static", StaticFiles(directory="static"), name="static")
