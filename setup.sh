#!/bin/bash
# UrbanPulse Quick Start Script

echo "=================================================="
echo "  UrbanPulse – Smart City Traffic Command"
echo "  Quick Start Script"
echo "=================================================="

# Check Python
if ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 not found. Please install Python 3.10+"
  exit 1
fi

# Check Node
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "📦 Installing backend dependencies..."
cd "$ROOT/backend"
pip install -r requirements.txt --quiet

echo ""
echo "🤖 Training LSTM model (this may take a few minutes)..."
cd "$ROOT/ai_model"
python3 train_lstm_model.py

echo ""
echo "📦 Installing frontend dependencies..."
cd "$ROOT/frontend"
npm install --legacy-peer-deps --silent

echo ""
echo "=================================================="
echo "✅ Setup complete!"
echo ""
echo "To start the backend:"
echo "  cd backend && uvicorn main:app --reload --port 8000"
echo ""
echo "To start the frontend (in a new terminal):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo "API docs:  http://localhost:8000/docs"
echo "=================================================="
