@echo off
echo ==================================================
echo   UrbanPulse - Smart City Traffic Command
echo   Windows Quick Start
echo ==================================================

echo.
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt

echo.
echo Training LSTM model...
cd ..\ai_model
python train_lstm_model.py

echo.
echo Installing frontend dependencies...
cd ..\frontend
npm install --legacy-peer-deps

echo.
echo ==================================================
echo Setup complete!
echo.
echo Start backend (Terminal 1):
echo   cd backend
echo   uvicorn main:app --reload --port 8000
echo.
echo Start frontend (Terminal 2):
echo   cd frontend
echo   npm run dev
echo.
echo Open: http://localhost:3000
echo ==================================================
pause
