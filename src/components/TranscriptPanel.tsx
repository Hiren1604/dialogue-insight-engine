
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { Mic } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const TranscriptPanel: React.FC = () => {
  const { metrics, isAnalyzing } = useAudioAnalysis();
  const transcriptEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [metrics.transcript]);

  const isAgent = (line: string) => line.startsWith('Agent:');

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-4 w-4" /> 
          Transcript
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          {isAnalyzing && metrics.transcript.length === 0 ? (
            <div className="flex flex-col gap-3 p-2">
              <div className="w-3/4 h-5 animate-shimmer rounded mb-1"></div>
              <div className="w-2/3 h-5 animate-shimmer rounded mb-1 self-end"></div>
              <div className="w-1/2 h-5 animate-shimmer rounded mb-1"></div>
              <div className="w-4/5 h-5 animate-shimmer rounded mb-1 self-end"></div>
            </div>
          ) : (
            <>
              {metrics.transcript.map((line, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${isAgent(line) ? 'mr-10' : 'ml-10'}`}
                >
                  <div className={`rounded-2xl px-4 py-2 ${
                    isAgent(line) 
                      ? 'bg-primary/10 text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {line}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranscriptPanel;
