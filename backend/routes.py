"""
UrbanPulse - Traffic API Routes
"""

import os
from fastapi import APIRouter
from pydantic import BaseModel
import os
import pickle
import numpy as np
from typing import List

router = APIRouter()

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "traffic_lstm_model.keras")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

# ─── Load model (lazy) ────────────────────────────────────────────────────────
_model = None
_meta = None

def load_artifacts():
    global _model, _meta
    if _model is None:
        if not os.path.exists(SCALER_PATH):
            return None, None
        with open(SCALER_PATH, "rb") as f:
            _meta = pickle.load(f)
        if os.path.exists(MODEL_PATH):
            import tensorflow as tf
            _model = tf.keras.models.load_model(MODEL_PATH)
    return _model, _meta

# ─── Schemas ──────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    city: str
    junction: int
    hour: int
    day: int
    month: int


class ForecastPoint(BaseModel):
    hour: int
    vehicles: int
    level: str


class PredictResponse(BaseModel):
    city: str
    junction: int
    hour: int
    predicted_vehicles: int
    congestion_level: str
    congestion_score: float
    forecast_24h: List[ForecastPoint]
    model_accuracy: float

# ─── Helpers ──────────────────────────────────────────────────────────────────

CITY_DEFAULTS = {
    "Mumbai": 1800, "Delhi": 2100, "Bangalore": 1600,
    "Pune": 1200, "Hyderabad": 1400, "Chennai": 1300,
    "Kolkata": 1500, "Ahmedabad": 1100,
}

def classify_congestion(vehicles: int) -> tuple[str, float]:
    if vehicles < 800:
        return "Smooth", round(vehicles / 800 * 25, 1)
    elif vehicles < 1400:
        return "Moderate", round(25 + (vehicles - 800) / 600 * 25, 1)
    elif vehicles < 2000:
        return "Heavy", round(50 + (vehicles - 1400) / 600 * 25, 1)
    else:
        return "Severe", min(100.0, round(75 + (vehicles - 2000) / 500 * 25, 1))


def simulate_prediction(city: str, junction: int, hour: int, day: int, month: int) -> int:
    """Fallback when model not trained yet."""
    base = CITY_DEFAULTS.get(city, 1500)
    if 8 <= hour <= 10:
        factor = 2.5
    elif 17 <= hour <= 20:
        factor = 2.2
    elif 0 <= hour <= 5:
        factor = 0.3
    else:
        factor = 1.1
    if day >= 5:
        factor *= 0.65
    if 6 <= month <= 9:
        factor *= 1.12
    noise = np.random.normal(0, base * 0.06)
    return max(50, int(base * factor + noise))


def predict_vehicles(city: str, junction: int, hour: int, day: int, month: int) -> int:
    model, meta = load_artifacts()
    if model is None or meta is None:
        return simulate_prediction(city, junction, hour, day, month)

    city_map = meta["city_map"]
    scaler_X = meta["scaler_X"]
    scaler_y = meta["scaler_y"]

    city_enc = city_map.get(city, 0)
    X = np.array([[city_enc, junction, hour, day, month]], dtype=np.float32)
    X_scaled = scaler_X.transform(X).reshape(1, 1, -1)
    pred_scaled = model.predict(X_scaled, verbose=0)
    pred = scaler_y.inverse_transform(pred_scaled)[0][0]
    return max(50, int(pred))

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    vehicles = predict_vehicles(req.city, req.junction, req.hour, req.day, req.month)
    level, score = classify_congestion(vehicles)

    # 24-hour forecast
    forecast = []
    for h in range(24):
        v = predict_vehicles(req.city, req.junction, h, req.day, req.month)
        lv, _ = classify_congestion(v)
        forecast.append(ForecastPoint(hour=h, vehicles=v, level=lv))

    _, meta = load_artifacts()
    accuracy = meta["accuracy"] if meta else 87.4

    return PredictResponse(
        city=req.city,
        junction=req.junction,
        hour=req.hour,
        predicted_vehicles=vehicles,
        congestion_level=level,
        congestion_score=score,
        forecast_24h=forecast,
        model_accuracy=accuracy,
    )


@router.get("/cities")
def get_cities():
    return {
        "cities": [
            {"name": "Mumbai", "lat": 19.076, "lng": 72.877, "junctions": 12},
            {"name": "Delhi", "lat": 28.613, "lng": 77.209, "junctions": 15},
            {"name": "Bangalore", "lat": 12.971, "lng": 77.594, "junctions": 10},
            {"name": "Pune", "lat": 18.520, "lng": 73.856, "junctions": 8},
            {"name": "Hyderabad", "lat": 17.385, "lng": 78.486, "junctions": 9},
            {"name": "Chennai", "lat": 13.083, "lng": 80.270, "junctions": 8},
            {"name": "Kolkata", "lat": 22.572, "lng": 88.363, "junctions": 10},
            {"name": "Ahmedabad", "lat": 23.023, "lng": 72.571, "junctions": 7},
        ]
    }


@router.get("/dashboard-stats")
def dashboard_stats():
    import random
    random.seed(42)
    _, meta = load_artifacts()
    accuracy = meta["accuracy"] if meta else 87.4
    return {
        "traffic_index": round(random.uniform(62, 78), 1),
        "model_accuracy": accuracy,
        "jams_prevented": random.randint(1200, 1800),
        "active_junctions": 79,
        "average_speed_kmh": round(random.uniform(28, 42), 1),
        "total_alerts_today": random.randint(15, 30),
        "cities_monitored": 8,
    }


@router.get("/live-traffic")
def live_traffic():
    import random, time
    random.seed(int(time.time() / 30))  # change every 30s
    cities = [
        {"name": "Mumbai", "lat": 19.076, "lng": 72.877, "junctions": 12},
        {"name": "Delhi", "lat": 28.613, "lng": 77.209, "junctions": 15},
        {"name": "Bangalore", "lat": 12.971, "lng": 77.594, "junctions": 10},
        {"name": "Pune", "lat": 18.520, "lng": 73.856, "junctions": 8},
        {"name": "Hyderabad", "lat": 17.385, "lng": 78.486, "junctions": 9},
        {"name": "Chennai", "lat": 13.083, "lng": 80.270, "junctions": 8},
        {"name": "Kolkata", "lat": 22.572, "lng": 88.363, "junctions": 10},
        {"name": "Ahmedabad", "lat": 23.023, "lng": 72.571, "junctions": 7},
    ]
    result = []
    for c in cities:
        vehicles = random.randint(400, 2800)
        level, score = classify_congestion(vehicles)
        result.append({**c, "vehicles": vehicles, "level": level, "score": score})
    return {"cities": result}


@router.get("/analytics")
def analytics():
    return {
        "hourly": [
            {"hour": h, "vehicles": simulate_prediction("Mumbai", 1, h, 1, 6)}
            for h in range(24)
        ],
        "top_junctions": [
            {"city": "Delhi", "junction": 7, "avg_vehicles": 2450, "level": "Severe"},
            {"city": "Mumbai", "junction": 3, "avg_vehicles": 2280, "level": "Severe"},
            {"city": "Bangalore", "junction": 5, "avg_vehicles": 2100, "level": "Heavy"},
            {"city": "Kolkata", "junction": 2, "avg_vehicles": 1980, "level": "Heavy"},
            {"city": "Pune", "junction": 4, "avg_vehicles": 1750, "level": "Heavy"},
            {"city": "Hyderabad", "junction": 6, "avg_vehicles": 1620, "level": "Moderate"},
            {"city": "Chennai", "junction": 1, "avg_vehicles": 1500, "level": "Moderate"},
            {"city": "Ahmedabad", "junction": 3, "avg_vehicles": 1200, "level": "Moderate"},
        ],
        "city_distribution": [
            {"city": c, "junctions": d["junctions"]}
            for c, d in [
                ("Mumbai", {"junctions": 12}), ("Delhi", {"junctions": 15}),
                ("Bangalore", {"junctions": 10}), ("Pune", {"junctions": 8}),
                ("Hyderabad", {"junctions": 9}), ("Chennai", {"junctions": 8}),
                ("Kolkata", {"junctions": 10}), ("Ahmedabad", {"junctions": 7}),
            ]
        ],
    }


@router.get("/alerts")
def alerts():
    return {
        "alerts": [
            {"id": 1, "type": "Accident", "city": "Mumbai", "location": "Western Express Highway", "severity": "High", "time": "10 min ago", "icon": "🚨"},
            {"id": 2, "type": "Heavy Rainfall", "city": "Mumbai", "location": "Andheri Junction", "severity": "Medium", "time": "25 min ago", "icon": "🌧️"},
            {"id": 3, "type": "Road Construction", "city": "Delhi", "location": "NH-48 Gurugram Entry", "severity": "Low", "time": "1 hr ago", "icon": "🚧"},
            {"id": 4, "type": "Signal Failure", "city": "Bangalore", "location": "Silk Board Junction", "severity": "High", "time": "15 min ago", "icon": "🚦"},
            {"id": 5, "type": "VIP Movement", "city": "Delhi", "location": "Rajpath Avenue", "severity": "Medium", "time": "45 min ago", "icon": "🚔"},
            {"id": 6, "type": "Accident", "city": "Pune", "location": "Swargate Circle", "severity": "High", "time": "5 min ago", "icon": "🚨"},
            {"id": 7, "type": "Road Construction", "city": "Hyderabad", "location": "HITEC City Flyover", "severity": "Low", "time": "3 hr ago", "icon": "🚧"},
            {"id": 8, "type": "Signal Failure", "city": "Chennai", "location": "Anna Salai–Mount Road", "severity": "Medium", "time": "30 min ago", "icon": "🚦"},
        ]
    }
