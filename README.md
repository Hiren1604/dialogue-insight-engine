
# Conversation Analysis Tool

This application analyzes conversations between customer care representatives and customers, providing real-time metrics and insights.

## Features

- Upload and analyze audio conversations
- Real-time sentiment analysis
- Emotion traits detection
- Agent performance metrics (response time, talking ratio, etc.)
- Call categorization (true/false positive/negative)
- Conversation summary and transcript

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- Python 3.8+ and pip

### Installation

1. Clone this repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Using the provided scripts

For macOS/Linux:
```
chmod +x run_app.sh
./run_app.sh
```

For Windows:
```
run_app.bat
```

#### Option 2: Manual startup

Start the backend:
```
cd backend
python app.py
```

In a separate terminal, start the frontend:
```
npm run dev
```

## How to Use

1. Access the web interface at http://localhost:8080
2. Upload an audio file of a customer service conversation
3. Click "Analyze Conversation"
4. View the analysis results on the dashboard

## Technologies Used

### Frontend
- React.js with TypeScript
- Tailwind CSS
- Shadcn/UI components
- Recharts for data visualization

### Backend
- Flask (Python)
- LibROSA for audio processing
- Hugging Face Transformers for sentiment analysis
- Scikit-learn for machine learning components

## Project Structure

```
/
├── backend/               # Flask backend
│   ├── app.py             # Main Flask application
│   └── requirements.txt   # Python dependencies
├── src/
│   ├── components/        # React components
│   ├── contexts/          # Context providers
│   ├── hooks/             # Custom React hooks
│   └── pages/             # Page components
└── public/               # Static assets
```
