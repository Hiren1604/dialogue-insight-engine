
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { Volume2 } from 'lucide-react';

const COLORS = {
  positive: '#10b981',
  neutral: '#94a3b8',
  negative: '#ef4444'
};

const EmotionChart: React.FC = () => {
  const { metrics, isAnalyzing } = useAudioAnalysis();
  
  const data = [
    { name: 'Positive', value: metrics.sentiment.positive, color: COLORS.positive },
    { name: 'Neutral', value: metrics.sentiment.neutral, color: COLORS.neutral },
    { name: 'Negative', value: metrics.sentiment.negative, color: COLORS.negative },
  ];

  if (isAnalyzing) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Volume2 className="h-4 w-4" />
            Sentiment Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 h-[200px] flex items-center justify-center">
          <div className="w-full h-32 animate-shimmer rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Volume2 className="h-4 w-4" />
          Sentiment Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={70} />
            <Tooltip 
              formatter={(value: any) => {
                // Handle different value types safely
                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                return isNaN(numValue) ? [value, 'Intensity'] : [`${numValue.toFixed(1)}%`, 'Intensity'];
              }}
              contentStyle={{ 
                borderRadius: '0.5rem', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmotionChart;
