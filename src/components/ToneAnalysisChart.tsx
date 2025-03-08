
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { Volume2 } from 'lucide-react';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ToneAnalysisChart: React.FC = () => {
  const { metrics, isAnalyzing } = useAudioAnalysis();
  const [data, setData] = useState<{time: number, score: number}[]>([]);
  
  useEffect(() => {
    if (metrics.toneAnalysis.scores.length > 0) {
      const chartData = metrics.toneAnalysis.scores.map((score, index) => ({
        time: metrics.toneAnalysis.timestamps[index],
        score: score
      }));
      setData(chartData);
    }
  }, [metrics.toneAnalysis]);

  if (isAnalyzing) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Volume2 className="h-4 w-4" />
            Agent Tone Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 h-[200px] flex items-center justify-center">
          <div className="w-full h-32 animate-shimmer rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  const renderTooltipContent = (props: any) => {
    const { payload, label } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-semibold">{`Time: ${formatTime(data.time)}`}</p>
          <p>{`Aggression Level: ${(data.score * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const getDataColor = (value: number) => {
    if (value < 0.3) return "#10b981"; // green for low aggression
    if (value < 0.6) return "#f59e0b"; // amber for medium
    return "#ef4444"; // red for high aggression
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Volume2 className="h-4 w-4" />
          Agent Tone Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 h-[200px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                name="Time"
                tickFormatter={formatTime}
                label={{ value: 'Time (mm:ss)', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis 
                domain={[0, 1]} 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                label={{ value: 'Aggression Level', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={renderTooltipContent} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#4f46e5" }}
              />
              <ReferenceArea y1={0} y2={0.3} fill="#10b981" fillOpacity={0.1} />
              <ReferenceArea y1={0.3} y2={0.6} fill="#f59e0b" fillOpacity={0.1} />
              <ReferenceArea y1={0.6} y2={1} fill="#ef4444" fillOpacity={0.1} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No tone analysis data available yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToneAnalysisChart;
