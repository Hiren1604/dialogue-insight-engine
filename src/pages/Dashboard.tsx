
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import AudioPlayer from '@/components/AudioPlayer';
import SentimentChart from '@/components/SentimentChart';
import ToneAnalysisChart from '@/components/ToneAnalysisChart';
import MetricsGrid from '@/components/MetricsGrid';
import CallSummary from '@/components/CallSummary';
import TranscriptPanel from '@/components/TranscriptPanel';
import { ArrowLeft } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { audioFile, isAnalyzing, isAnalysisComplete } = useAudioAnalysis();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if no audio file is loaded
    if (!audioFile && !isAnalyzing && !isAnalysisComplete) {
      navigate('/');
    }
  }, [audioFile, isAnalyzing, isAnalysisComplete, navigate]);

  const staggerDelay = 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Conversation Analytics</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <AudioPlayer />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: staggerDelay }}
          >
            <SentimentChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: staggerDelay * 2 }}
          >
            <ToneAnalysisChart />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: staggerDelay * 3 }}
          className="mb-6"
        >
          <MetricsGrid />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: staggerDelay * 4 }}
          >
            <CallSummary />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: staggerDelay * 5 }}
          >
            <TranscriptPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
