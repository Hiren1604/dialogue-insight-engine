
@echo off
echo Starting Flask backend...
cd backend
pip install -r requirements.txt
start python app.py

echo Waiting for backend to initialize...
timeout /t 5 /nobreak

echo Starting frontend...
cd ..
call npm install
call npm run dev

echo Application is running! Press Ctrl+C in each window to stop.
