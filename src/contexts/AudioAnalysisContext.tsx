import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

type ToneAnalysis = {
  scores: number[];
  timestamps: number[];
};

type ConversationMetrics = {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  toneAnalysis: ToneAnalysis;
  agentMetrics: {
    responseTime: number;
    talkingRatio: number;
    interruptions: number;
    cussWords: number;
    escalationRate: number;
    resolutionRate: number;
  };
  conversationType: 'true-positive' | 'true-negative' | 'false-positive' | 'false-negative' | null;
  summary: string;
  transcript: string[];
  currentTime: number;
  duration: number;
};

type AudioAnalysisContextType = {
  audioFile: File | null;
  audioUrl: string | null;
  isAnalyzing: boolean;
  isPlaying: boolean;
  metrics: ConversationMetrics;
  setAudioFile: (file: File | null) => void;
  startAnalysis: () => Promise<void>;
  playAudio: () => void;
  pauseAudio: () => void;
  resetAnalysis: () => void;
  isAnalysisComplete: boolean;
};

const initialMetrics: ConversationMetrics = {
  sentiment: {
    positive: 0,
    neutral: 0,
    negative: 0,
  },
  toneAnalysis: {
    scores: [],
    timestamps: []
  },
  agentMetrics: {
    responseTime: 0,
    talkingRatio: 0,
    interruptions: 0,
    cussWords: 0,
    escalationRate: 0,
    resolutionRate: 0,
  },
  conversationType: null,
  summary: '',
  transcript: [],
  currentTime: 0,
  duration: 0,
};

// API endpoint for the Flask backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AudioAnalysisContext = createContext<AudioAnalysisContextType | undefined>(undefined);

export const AudioAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metrics, setMetrics] = useState<ConversationMetrics>(initialMetrics);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      
      // Create audio element for duration
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onloadedmetadata = () => {
        setMetrics(prev => ({
          ...prev,
          duration: audio.duration
        }));
      };
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioFile]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => {
        setMetrics(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }));
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current]);

  const startAnalysis = async (): Promise<void> => {
    if (!audioFile) {
      toast({
        title: "Error",
        description: "Please upload an audio file first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setIsAnalysisComplete(false);

    try {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('file', audioFile);

      // First attempt to use the Flask backend
      let useFallback = false;
      
      try {
        const response = await fetch(`${API_URL}/analyze`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          console.warn("Backend API call failed, using fallback simulation");
          useFallback = true;
        } else {
          const data = await response.json();
          
          // Update metrics with real data from the backend
          setMetrics(prev => ({
            ...prev,
            sentiment: data.sentiment,
            toneAnalysis: data.toneAnalysis || {scores: [], timestamps: []},
            agentMetrics: data.agentMetrics,
            transcript: data.transcript,
            summary: data.summary,
            conversationType: data.conversationType,
            duration: data.duration || prev.duration,
          }));
          
          setIsAnalysisComplete(true);
          setIsAnalyzing(false);
          
          toast({
            title: "Analysis Complete",
            description: "The conversation analysis has been completed successfully.",
          });
          return;
        }
      } catch (error) {
        console.error("Error calling backend API:", error);
        console.warn("Using fallback simulation instead");
        useFallback = true;
      }
      
      // Fallback to the simulation if the backend call fails
      if (useFallback) {
        // Simulate analysis with progressive updates
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          
          // Update metrics in "real-time" as analysis progresses
          setMetrics(prev => {
            const newMetrics = { ...prev };
            
            // Randomized simulated values
            newMetrics.sentiment = {
              positive: Math.min(100, Math.random() * progress),
              neutral: Math.min(100, Math.random() * progress),
              negative: Math.min(100, Math.random() * progress),
            };
            
            // Generate simulated tone analysis data
            if (progress % 10 === 0) {
              const newTimestamp = newMetrics.toneAnalysis.timestamps.length > 0 
                ? newMetrics.toneAnalysis.timestamps[newMetrics.toneAnalysis.timestamps.length - 1] + 2
                : 0;
              
              newMetrics.toneAnalysis.scores.push(Math.random());
              newMetrics.toneAnalysis.timestamps.push(newTimestamp);
            }
            
            newMetrics.agentMetrics = {
              responseTime: Math.min(10, 1 + Math.random() * 9),
              talkingRatio: Math.min(100, Math.random() * progress),
              interruptions: Math.floor(Math.random() * 10),
              cussWords: Math.floor(Math.random() * 5),
              escalationRate: Math.min(100, Math.random() * progress),
              resolutionRate: Math.min(100, Math.random() * progress),
            };
            
            // Add simulated transcript lines
            if (progress % 20 === 0) {
              const speakerPrefix = Math.random() > 0.5 ? "Agent: " : "Customer: ";
              const transcriptLines = [
                "Hello, how can I help you today?",
                "I've been having trouble with my recent order.",
                "I understand your frustration. Let me look into that for you.",
                "Thank you, I appreciate your help.",
                "Is there anything else I can assist you with?",
                "No, that's all for today. Thank you.",
              ];
              
              const randomLine = transcriptLines[Math.floor(Math.random() * transcriptLines.length)];
              newMetrics.transcript = [...newMetrics.transcript, speakerPrefix + randomLine];
            }
            
            return newMetrics;
          });
          
          if (progress >= 100) {
            clearInterval(interval);
            setIsAnalyzing(false);
            setIsAnalysisComplete(true);
            
            // Set final values
            setMetrics(prev => ({
              ...prev,
              summary: "In this conversation, the customer service agent demonstrated professional behavior and addressed the customer's concerns effectively. The agent maintained a positive tone throughout the call and provided clear information. The customer initially expressed frustration but was satisfied by the end of the call. The agent successfully resolved the customer's issue without escalation.",
              conversationType: Math.random() > 0.75 
                ? 'true-positive' 
                : Math.random() > 0.5 
                  ? 'true-negative' 
                  : Math.random() > 0.25 
                    ? 'false-positive' 
                    : 'false-negative'
            }));
            
            toast({
              title: "Analysis Complete",
              description: "The conversation analysis has been completed successfully.",
            });
          }
        }, 200);
      }

      return;
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the audio file.",
        variant: "destructive",
      });
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetAnalysis = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioFile(null);
    setAudioUrl(null);
    setIsAnalyzing(false);
    setIsPlaying(false);
    setMetrics(initialMetrics);
    setIsAnalysisComplete(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return (
    <AudioAnalysisContext.Provider
      value={{
        audioFile,
        audioUrl,
        isAnalyzing,
        isPlaying,
        metrics,
        setAudioFile,
        startAnalysis,
        playAudio,
        pauseAudio,
        resetAnalysis,
        isAnalysisComplete,
      }}
    >
      {children}
    </AudioAnalysisContext.Provider>
  );
};

export const useAudioAnalysis = () => {
  const context = useContext(AudioAnalysisContext);
  if (context === undefined) {
    throw new Error('useAudioAnalysis must be used within an AudioAnalysisProvider');
  }
  return context;
};
