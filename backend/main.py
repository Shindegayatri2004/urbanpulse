"""
UrbanPulse - FastAPI Backend
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# import routers
from routes import router as traffic_router
from auth import router as auth_router


app = FastAPI(
    title="UrbanPulse API",
    description="Smart City Traffic Prediction System",
    version="1.0.0",
)

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(traffic_router, prefix="/api", tags=["Traffic"])


@app.get("/")
def root():
    return {
        "message": "UrbanPulse API is running 🚦",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)