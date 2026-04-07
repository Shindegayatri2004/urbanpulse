"""
UrbanPulse - LSTM Traffic Prediction Model Training Script
Generates synthetic traffic data and trains an LSTM model.
Run this once to generate the model files before starting the backend.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import pickle
import os
import sys

print("Installing dependencies if needed...")
os.system(f"{sys.executable} -m pip install tensorflow scikit-learn numpy pandas --quiet")

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

print("=" * 60)
print("UrbanPulse - LSTM Traffic Model Training")
print("=" * 60)

# ──────────────────────────────────────────────
# 1. Generate synthetic traffic dataset
# ──────────────────────────────────────────────
np.random.seed(42)
tf.random.set_seed(42)

CITIES = {
    "Mumbai": {"base": 1800, "peak_mult": 2.8, "junctions": 12},
    "Delhi": {"base": 2100, "peak_mult": 3.1, "junctions": 15},
    "Bangalore": {"base": 1600, "peak_mult": 2.6, "junctions": 10},
    "Pune": {"base": 1200, "peak_mult": 2.4, "junctions": 8},
    "Hyderabad": {"base": 1400, "peak_mult": 2.5, "junctions": 9},
    "Chennai": {"base": 1300, "peak_mult": 2.3, "junctions": 8},
    "Kolkata": {"base": 1500, "peak_mult": 2.7, "junctions": 10},
    "Ahmedabad": {"base": 1100, "peak_mult": 2.2, "junctions": 7},
}

records = []
for city, cfg in CITIES.items():
    for junction in range(1, cfg["junctions"] + 1):
        for month in range(1, 13):
            for day in range(0, 7):  # 0=Mon ... 6=Sun
                for hour in range(0, 24):
                    base = cfg["base"]
                    # Morning peak 8-10
                    if 8 <= hour <= 10:
                        factor = cfg["peak_mult"]
                    # Evening peak 17-20
                    elif 17 <= hour <= 20:
                        factor = cfg["peak_mult"] * 0.9
                    # Night low
                    elif 0 <= hour <= 5:
                        factor = 0.25
                    else:
                        factor = 1.0 + 0.3 * np.sin(np.pi * hour / 12)

                    # Weekend reduction
                    if day >= 5:
                        factor *= 0.65

                    # Monsoon months (Jun-Sep) slight congestion spike
                    if 6 <= month <= 9:
                        factor *= 1.15

                    vehicles = int(base * factor + np.random.normal(0, base * 0.08))
                    vehicles = max(50, vehicles)

                    records.append({
                        "city": city,
                        "junction": junction,
                        "hour": hour,
                        "day": day,
                        "month": month,
                        "vehicles": vehicles,
                    })

df = pd.DataFrame(records)
print(f"Dataset size: {len(df):,} rows")
print(df.head())

# ──────────────────────────────────────────────
# 2. Feature engineering
# ──────────────────────────────────────────────
city_map = {c: i for i, c in enumerate(CITIES.keys())}
df["city_enc"] = df["city"].map(city_map)

features = ["city_enc", "junction", "hour", "day", "month"]
target = "vehicles"

X = df[features].values.astype(np.float32)
y = df[target].values.astype(np.float32)

# Scale features
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()
X_scaled = scaler_X.fit_transform(X)
y_scaled = scaler_y.fit_transform(y.reshape(-1, 1))

# Reshape for LSTM: (samples, timesteps=1, features)
X_lstm = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))

# Train/val split
split = int(len(X_lstm) * 0.85)
X_train, X_val = X_lstm[:split], X_lstm[split:]
y_train, y_val = y_scaled[:split], y_scaled[split:]

print(f"Train: {X_train.shape}, Val: {X_val.shape}")

# ──────────────────────────────────────────────
# 3. Build LSTM model
# ──────────────────────────────────────────────
model = Sequential([
    LSTM(128, input_shape=(1, len(features)), return_sequences=True),
    BatchNormalization(),
    Dropout(0.3),
    LSTM(64, return_sequences=False),
    BatchNormalization(),
    Dropout(0.2),
    Dense(32, activation="relu"),
    Dense(16, activation="relu"),
    Dense(1),
])

model.compile(optimizer=tf.keras.optimizers.Adam(0.001), loss="mse", metrics=["mae"])
model.summary()

callbacks = [
    EarlyStopping(patience=8, restore_best_weights=True, monitor="val_loss"),
    ReduceLROnPlateau(factor=0.5, patience=4, monitor="val_loss"),
]

print("\nTraining model...")
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=60,
    batch_size=512,
    callbacks=callbacks,
    verbose=1,
)

# ──────────────────────────────────────────────
# 4. Evaluate
# ──────────────────────────────────────────────
loss, mae = model.evaluate(X_val, y_val, verbose=0)
y_pred = model.predict(X_val[:100], verbose=0)
y_pred_inv = scaler_y.inverse_transform(y_pred)
y_true_inv = scaler_y.inverse_transform(y_val[:100])
mape = np.mean(np.abs((y_true_inv - y_pred_inv) / (y_true_inv + 1))) * 100
accuracy = max(0, 100 - mape)
print(f"\nModel Accuracy: {accuracy:.1f}%")
print(f"Val MAE (scaled): {mae:.4f}")

# ──────────────────────────────────────────────
# 5. Save artifacts
# ──────────────────────────────────────────────
os.makedirs("../models", exist_ok=True)
model.save("../models/traffic_lstm_model.keras")
print("Model saved → models/traffic_lstm_model.keras")

with open("../models/scaler.pkl", "wb") as f:
    pickle.dump({"scaler_X": scaler_X, "scaler_y": scaler_y,
                 "city_map": city_map, "accuracy": round(accuracy, 1),
                 "history": {k: [float(v) for v in vals]
                             for k, vals in history.history.items()}}, f)
print("Scalers saved → models/scaler.pkl")
print("\n✅ Training complete! Run the backend with: uvicorn main:app --reload")
