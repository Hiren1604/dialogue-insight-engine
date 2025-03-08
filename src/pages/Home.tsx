import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { Upload, AudioWaveform, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { toast } = useToast();
  const { setAudioFile, startAnalysis, isAnalyzing } = useAudioAnalysis();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    setAudioFile(file);
    setFileName(file.name);
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!fileName) {
      toast({
        title: "No File Selected",
        description: "Please upload an audio file before analyzing.",
        variant: "destructive",
      });
      return;
    }
    
    await startAnalysis();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Conversation Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Upload a customer service call audio file to analyze and evaluate the conversation in real-time.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-3xl"
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            glass-card rounded-2xl p-12 flex flex-col items-center justify-center transition-all
            min-h-[300px] cursor-pointer border-2 border-dashed
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          `}
          onClick={handleButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="audio/*"
            className="hidden"
          />
          
          {fileName ? (
            <div className="text-center animate-fade-in">
              <div className="mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <AudioWaveform size={32} />
              </div>
              <p className="text-lg font-medium mb-1">{fileName}</p>
              <p className="text-muted-foreground mb-6">File uploaded successfully</p>
              <div className="audio-wave flex items-end justify-center h-10 mb-4">
                <motion.span className="animate-wave1"></motion.span>
                <motion.span className="animate-wave2"></motion.span>
                <motion.span className="animate-wave3"></motion.span>
                <motion.span className="animate-wave4"></motion.span>
                <motion.span className="animate-wave5"></motion.span>
                <motion.span className="animate-wave4"></motion.span>
                <motion.span className="animate-wave3"></motion.span>
                <motion.span className="animate-wave2"></motion.span>
                <motion.span className="animate-wave1"></motion.span>
              </div>
              <p className="text-sm text-muted-foreground">
                Click to change file
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Upload Audio File</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP3, WAV, M4A, and more
              </p>
            </>
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Button 
          size="lg" 
          onClick={handleAnalyze} 
          disabled={!fileName || isAnalyzing}
          className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Conversation"} 
          {!isAnalyzing && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
