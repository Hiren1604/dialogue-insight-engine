
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import librosa
import torch
from transformers import pipeline
import tempfile
import base64
import json

app = Flask(__name__)
CORS(app)

# Initialize sentiment analysis model
try:
    sentiment_model = pipeline("sentiment-analysis")
except Exception as e:
    print(f"Failed to load sentiment model: {e}")
    sentiment_model = None

# Initialize audio classification model
try:
    emotion_classifier = pipeline("audio-classification", model="MIT/ast-finetuned-audioset-10-10-0.4593")
except Exception as e:
    print(f"Failed to load audio classification model: {e}")
    emotion_classifier = None

@app.route('/')
def home():
    return "Audio Analysis API is running!"

@app.route('/analyze', methods=['POST'])
def analyze_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        # Save uploaded file to a temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        file.save(temp_file.name)
        temp_file.close()
        
        # Load audio and extract features
        y, sr = librosa.load(temp_file.name, sr=None)
        
        # Generate Sentiment Analysis
        sentiment_scores = analyze_sentiment(y, sr)
        
        # Generate Emotion Traits
        emotion_traits = analyze_emotions(temp_file.name)
        
        # Generate Agent Metrics
        agent_metrics = generate_agent_metrics(y, sr)
        
        # Generate Sample Transcript
        transcript = generate_sample_transcript()
        
        # Generate Summary
        summary = "In this conversation, the customer service agent demonstrated professional behavior and addressed the customer's concerns effectively. The agent maintained a positive tone throughout the call and provided clear information."
        
        # Determine conversation type
        conv_types = ["true-positive", "true-negative", "false-positive", "false-negative"]
        conversation_type = np.random.choice(conv_types)
        
        # Clean up temp file
        os.unlink(temp_file.name)
        
        return jsonify({
            "sentiment": sentiment_scores,
            "emotionTraits": emotion_traits,
            "agentMetrics": agent_metrics,
            "transcript": transcript,
            "summary": summary,
            "conversationType": conversation_type,
            "duration": len(y) / sr
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def analyze_sentiment(audio_data, sample_rate):
    """Extract sentiment scores from audio data"""
    try:
        # Use librosa to extract audio features
        mfccs = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=13)
        mfccs_mean = np.mean(mfccs, axis=1)
        
        # In a real implementation, you would use these features with a trained model
        # For demo, we'll generate random scores biased by audio energy
        
        # Use audio energy to bias the sentiment scores
        energy = np.mean(librosa.feature.rms(y=audio_data))
        energy_normalized = min(energy * 10, 1.0)  # Normalize energy to 0-1
        
        positive = np.clip(50 + energy_normalized * 30 + np.random.normal(0, 10), 0, 100)
        negative = np.clip(40 - energy_normalized * 20 + np.random.normal(0, 10), 0, 100)
        neutral = np.clip(100 - positive - negative, 0, 100)
        
        return {
            "positive": float(positive),
            "negative": float(negative),
            "neutral": float(neutral)
        }
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return {"positive": 33.3, "negative": 33.3, "neutral": 33.4}

def analyze_emotions(audio_file_path):
    """Analyze emotions in the audio file"""
    try:
        if emotion_classifier is not None:
            # Use the pre-trained model to classify emotions
            emotions = emotion_classifier(audio_file_path)
            
            # Map the results to the expected emotion traits
            emotion_map = {
                "happy": "joy",
                "sad": "sadness",
                "angry": "anger",
                "fearful": "fear",
                "surprised": "surprise"
            }
            
            # Initialize default values
            emotion_traits = {
                "joy": 0,
                "sadness": 0,
                "anger": 0,
                "fear": 0,
                "surprise": 0
            }
            
            # Update values based on classifier output
            for emotion in emotions:
                for key, value in emotion_map.items():
                    if key in emotion["label"].lower() and emotion["score"] > 0:
                        emotion_traits[value] = emotion["score"] * 100
            
            # Ensure all values are between 0-100
            for key in emotion_traits:
                emotion_traits[key] = min(max(emotion_traits[key], 0), 100)
                
            return emotion_traits
        else:
            # Fallback to random values if model not loaded
            return {
                "joy": float(np.random.uniform(0, 100)),
                "sadness": float(np.random.uniform(0, 100)),
                "anger": float(np.random.uniform(0, 100)),
                "fear": float(np.random.uniform(0, 100)),
                "surprise": float(np.random.uniform(0, 100))
            }
    except Exception as e:
        print(f"Error in emotion analysis: {e}")
        return {
            "joy": float(np.random.uniform(0, 100)),
            "sadness": float(np.random.uniform(0, 100)),
            "anger": float(np.random.uniform(0, 100)),
            "fear": float(np.random.uniform(0, 100)),
            "surprise": float(np.random.uniform(0, 100))
        }

def generate_agent_metrics(audio_data, sample_rate):
    """Generate agent metrics based on audio data"""
    try:
        # These would typically use more sophisticated audio analysis
        # For this demo, we're generating reasonable random values
        
        # Calculate some basic audio features
        rms = librosa.feature.rms(y=audio_data).mean()
        zcr = librosa.feature.zero_crossing_rate(audio_data).mean()
        
        # Use audio features to bias the random metrics
        response_time = float(np.clip(2 + rms * 5 + np.random.normal(0, 1), 1, 10))
        talking_ratio = float(np.clip(50 + zcr * 200 + np.random.normal(0, 10), 0, 100))
        interruptions = int(np.clip(zcr * 100 + np.random.normal(0, 2), 0, 10))
        cuss_words = int(np.clip(np.random.normal(0, 1), 0, 5))
        escalation_rate = float(np.clip(20 + np.random.normal(0, 10), 0, 100))
        resolution_rate = float(np.clip(75 + np.random.normal(0, 10), 0, 100))
        
        return {
            "responseTime": response_time,
            "talkingRatio": talking_ratio,
            "interruptions": interruptions,
            "cussWords": cuss_words,
            "escalationRate": escalation_rate,
            "resolutionRate": resolution_rate
        }
    except Exception as e:
        print(f"Error generating agent metrics: {e}")
        return {
            "responseTime": float(np.random.uniform(1, 10)),
            "talkingRatio": float(np.random.uniform(30, 70)),
            "interruptions": int(np.random.randint(0, 10)),
            "cussWords": int(np.random.randint(0, 5)),
            "escalationRate": float(np.random.uniform(0, 100)),
            "resolutionRate": float(np.random.uniform(0, 100))
        }

def generate_sample_transcript():
    """Generate a sample transcript for demo purposes"""
    transcript_parts = [
        "Agent: Hello, thank you for calling customer service. How may I help you today?",
        "Customer: Hi, I'm having trouble with my recent order. It hasn't arrived yet.",
        "Agent: I apologize for the inconvenience. Let me check the status of your order. Could you provide your order number?",
        "Customer: Yes, it's ABC12345.",
        "Agent: Thank you. I see your order was shipped two days ago and is scheduled for delivery tomorrow.",
        "Customer: That's great news! I was worried it got lost.",
        "Agent: I understand your concern. Is there anything else I can help you with today?",
        "Customer: No, that's all. Thank you for your help.",
        "Agent: You're welcome. Have a great day!"
    ]
    return transcript_parts

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
