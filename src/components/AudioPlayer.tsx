
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { Play, Pause, RefreshCw } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const { 
    audioUrl, 
    isPlaying, 
    playAudio, 
    pauseAudio, 
    resetAnalysis,
    metrics
  } = useAudioAnalysis();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSliderChange = (value: number[]) => {
    // In a real implementation, this would seek the audio
    console.log("Seeking to:", value[0]);
  };

  if (!audioUrl) return null;

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={isPlaying ? pauseAudio : playAudio}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        <div className="flex-1">
          <Slider
            value={[metrics.currentTime]}
            max={metrics.duration || 100}
            step={1}
            onValueChange={handleSliderChange}
            className="my-1.5"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(metrics.currentTime)}</span>
            <span>{formatTime(metrics.duration)}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          onClick={resetAnalysis}
        >
          <RefreshCw size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
