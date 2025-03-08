
#!/bin/bash

# Start the Flask backend
echo "Starting Flask backend..."
cd backend
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

# Wait for the backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Start the frontend
echo "Starting frontend..."
cd ..
npm install
npm run dev &
FRONTEND_PID=$!

# Function to handle exit
function cleanup {
  echo "Shutting down services..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap Ctrl+C
trap cleanup INT

# Keep script running
echo "Application is running! Press Ctrl+C to stop."
wait
