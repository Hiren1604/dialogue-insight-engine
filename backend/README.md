
# Audio Analysis Backend

This is a Flask-based backend for the Conversation Analysis tool. It uses various Python libraries to analyze audio files and extract sentiment, emotions, and other metrics.

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the server:
   ```
   python app.py
   ```

The server will run on http://localhost:5000 by default.

## API Endpoints

- `POST /analyze` - Upload an audio file for analysis
  - Expects a form-data with a file field named 'file'
  - Returns JSON with sentiment, emotion traits, agent metrics, transcript, and summary

## Models Used

- Hugging Face Transformers for sentiment analysis
- LibROSA for audio feature extraction
- Custom metrics generation based on audio features
