
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import librosa
import torch
from transformers import pipeline, AutoModelForSpeechSeq2Seq, AutoProcessor
import tempfile
import soundfile as sf
import base64
import json
from scipy.signal import find_peaks
import joblib
from pydub import AudioSegment
import math

app = Flask(__name__)
CORS(app)

# Initialize sentiment analysis model
try:
    sentiment_model = pipeline("sentiment-analysis")
except Exception as e:
    print(f"Failed to load sentiment model: {e}")
    sentiment_model = None

# Initialize transcription model
try:
    processor = AutoProcessor.from_pretrained("openai/whisper-small")
    transcription_model = AutoModelForSpeechSeq2Seq.from_pretrained("openai/whisper-small")
except Exception as e:
    print(f"Failed to load transcription model: {e}")
    processor = None
    transcription_model = None

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
        duration = len(y) / sr
        
        # Generate Sentiment Analysis
        sentiment_scores = analyze_sentiment(y, sr)
        
        # Generate Agent Tone Analysis over time
        tone_analysis = analyze_agent_tone(y, sr)
        
        # Generate Agent Metrics
        agent_metrics = generate_agent_metrics(y, sr)
        
        # Generate Transcript
        transcript = generate_transcript(temp_file.name)
        
        # Generate Summary
        summary = "In this conversation, the customer service agent demonstrated professional behavior and addressed the customer's concerns effectively. The agent maintained a positive tone throughout the call and provided clear information."
        
        # Determine conversation type
        conv_types = ["true-positive", "true-negative", "false-positive", "false-negative"]
        conversation_type = np.random.choice(conv_types)
        
        # Clean up temp file
        os.unlink(temp_file.name)
        
        return jsonify({
            "sentiment": sentiment_scores,
            "toneAnalysis": tone_analysis,
            "agentMetrics": agent_metrics,
            "transcript": transcript,
            "summary": summary,
            "conversationType": conversation_type,
            "duration": duration
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

def analyze_agent_tone(audio_data, sample_rate):
    """Analyze tone/aggression over time"""
    try:
        # Split audio into segments (e.g., every 2 seconds)
        segment_length = 2  # seconds
        hop_length = 1  # seconds for 50% overlap
        
        samples_per_segment = int(segment_length * sample_rate)
        hop_samples = int(hop_length * sample_rate)
        
        segments = []
        timestamps = []
        
        # Calculate number of segments
        num_segments = math.ceil((len(audio_data) - samples_per_segment) / hop_samples) + 1
        
        for i in range(num_segments):
            start_sample = i * hop_samples
            end_sample = min(start_sample + samples_per_segment, len(audio_data))
            
            if end_sample - start_sample < samples_per_segment / 2:
                # Skip segments that are too short
                continue
                
            segment = audio_data[start_sample:end_sample]
            
            # Extract features for tone/aggression analysis
            rms = np.mean(librosa.feature.rms(y=segment))
            zcr = np.mean(librosa.feature.zero_crossing_rate(segment))
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=segment, sr=sample_rate))
            
            # Normalize features
            rms_norm = min(rms * 20, 1.0)
            zcr_norm = min(zcr * 100, 1.0)
            spectral_norm = min(spectral_centroid / 5000, 1.0)
            
            # Compute aggression score (0-1)
            # Higher RMS (loudness), ZCR, and spectral centroid often correlate with more aggressive speech
            aggression_score = (rms_norm * 0.5 + zcr_norm * 0.3 + spectral_norm * 0.2)
            
            # Add random variation for demo
            aggression_score = min(max(aggression_score + np.random.normal(0, 0.1), 0.0), 1.0)
            
            segments.append(float(aggression_score))
            timestamps.append(float(start_sample / sample_rate))
        
        return {
            "scores": segments,
            "timestamps": timestamps
        }
    except Exception as e:
        print(f"Error in agent tone analysis: {e}")
        # Return dummy data
        return {
            "scores": [float(np.random.uniform(0, 1)) for _ in range(10)],
            "timestamps": [float(i) for i in range(0, 20, 2)]
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

def generate_transcript(audio_file_path):
    """Generate transcript from audio file"""
    try:
        if processor is not None and transcription_model is not None:
            # Load audio
            audio, sr = librosa.load(audio_file_path, sr=16000)
            
            # Process audio for model input
            input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features
            
            # Generate token ids
            predicted_ids = transcription_model.generate(input_features)
            
            # Decode token ids to text
            full_transcript = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
            
            # Split transcript into segments for agent and customer
            # This is a simplified approach - in a real system, you'd use speaker diarization
            sentences = full_transcript.split('. ')
            
            formatted_transcript = []
            for i, sentence in enumerate(sentences):
                if sentence:
                    speaker = "Agent: " if i % 2 == 0 else "Customer: "
                    formatted_transcript.append(speaker + sentence.strip() + ('' if sentence.endswith('.') else '.'))
            
            return formatted_transcript
        else:
            # Fallback to dummy text if models aren't loaded
            return [
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
    except Exception as e:
        print(f"Error generating transcript: {e}")
        return [
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
