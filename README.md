# 🚦 UrbanPulse – Smart City Traffic Command

> AI-powered traffic intelligence system for Indian smart cities.  
> Uses LSTM deep learning to predict congestion and optimize travel routes.

---

## 📸 Features

| Page | Description |
|------|-------------|
| 🏠 **Landing** | Futuristic hero with stats, features, quick links |
| 📊 **Dashboard** | Real-time metric cards, hourly traffic chart, LSTM training curve |
| 🧠 **AI Prediction** | Select city/junction/hour → LSTM predicts congestion + 24h forecast |
| 🗺️ **Live Map** | SVG India heatmap with city congestion markers + route optimizer |
| 📈 **Analytics** | Hourly patterns, pie charts, ranked junction table |
| 🔔 **Alerts** | Real-time incident alerts with severity badges |
| 👤 **Profile** | User info, activity stats, logout |
| 🔐 **Auth** | JWT login/signup stored in SQLite |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Backend | FastAPI (Python) |
| AI Model | TensorFlow/Keras LSTM |
| Database | SQLite |
| Auth | JWT (PyJWT) |

---

## 📁 Project Structure

```
urbanpulse/
├── frontend/                    # Next.js app
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── PageLayout.tsx
│   │   ├── MetricCard.tsx
│   │   └── api.ts              # Axios API client
│   ├── pages/
│   │   ├── index.tsx           # Landing page
│   │   ├── profile.tsx         # User profile
│   │   ├── dashboard/
│   │   ├── prediction/
│   │   ├── map/
│   │   ├── analytics/
│   │   ├── alerts/
│   │   └── auth/               # login, signup
│   └── styles/globals.css
│
├── backend/
│   ├── main.py                 # FastAPI entrypoint
│   ├── routes.py               # Traffic API routes
│   ├── auth.py                 # JWT auth + SQLite
│   └── requirements.txt
│
├── ai_model/
│   └── train_lstm_model.py     # LSTM training script
│
├── models/                     # Generated after training
│   ├── traffic_lstm_model.keras
│   └── scaler.pkl
│
├── database/
│   └── users.db               # SQLite (auto-created)
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10 or 3.11
- **Node.js** 18+
- **npm** or **yarn**

---

### Step 1 – Install Backend

```bash
cd urbanpulse/backend
pip install -r requirements.txt
```

---

### Step 2 – Train the LSTM Model (optional but recommended)

```bash
cd urbanpulse/ai_model
python train_lstm_model.py
```

> ⏱ Training takes ~2–5 minutes on CPU.  
> If you skip this, the backend uses a smart simulation fallback automatically.

---

### Step 3 – Start the Backend

```bash
cd urbanpulse/backend
uvicorn main:app --reload --port 8000
```

Backend API docs: http://localhost:8000/docs

---

### Step 4 – Install Frontend

```bash
cd urbanpulse/frontend
npm install
```

---

### Step 5 – Start the Frontend

```bash
npm run dev
```

Open: http://localhost:3000

---

## 🔑 Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login (returns JWT) |
| GET | `/auth/me` | Get current user profile |
| POST | `/api/predict` | Run LSTM traffic prediction |
| GET | `/api/cities` | List all monitored cities |
| GET | `/api/dashboard-stats` | Dashboard KPI metrics |
| GET | `/api/live-traffic` | Real-time traffic per city |
| GET | `/api/analytics` | Analytics data |
| GET | `/api/alerts` | Traffic incident alerts |

### Predict Example

```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Mumbai",
    "junction": 3,
    "hour": 9,
    "day": 0,
    "month": 6
  }'
```

Response:
```json
{
  "city": "Mumbai",
  "junction": 3,
  "hour": 9,
  "predicted_vehicles": 2284,
  "congestion_level": "Heavy",
  "congestion_score": 71.4,
  "forecast_24h": [...],
  "model_accuracy": 94.7
}
```

---

## 🤖 AI Model Details

### Architecture
- **Type:** LSTM (Long Short-Term Memory) Neural Network
- **Framework:** TensorFlow / Keras
- **Layers:** LSTM(128) → BatchNorm → Dropout → LSTM(64) → Dense(32) → Dense(16) → Dense(1)

### Input Features
| Feature | Description |
|---------|-------------|
| city_enc | City ID (0–7) |
| junction | Junction number (1–15) |
| hour | Hour of day (0–23) |
| day | Day of week (0=Mon, 6=Sun) |
| month | Month (1–12) |

### Output
- Predicted vehicle count
- Congestion classification: Smooth / Moderate / Heavy / Severe

### Training Data
- 8 Indian cities: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad
- Synthetic dataset with realistic peak patterns, weekend factors, monsoon effects

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary background | `#060b14` |
| Card background | `rgba(0,212,255,0.04)` |
| Neon blue | `#00d4ff` |
| Smooth green | `#00ff88` |
| Moderate yellow | `#ffee00` |
| Heavy orange | `#ff8800` |
| Severe red | `#ff2244` |
| Font display | Orbitron |
| Font body | Rajdhani |

---

## ⚠️ Troubleshooting

**Backend won't start?**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Frontend npm install fails?**
```bash
npm install --legacy-peer-deps
```

**CORS errors?**
Make sure backend is running on port 8000 and frontend on port 3000.

**Model not loading?**
Run the training script first: `python ai_model/train_lstm_model.py`  
Or the backend uses simulation mode automatically.

---

## 📄 License

MIT License — Free for educational and commercial use.

---

> Built with ❤️ for Smart City Innovation · UrbanPulse 2024
