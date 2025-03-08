
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';

const COLORS = {
  joy: '#10b981',
  surprise: '#3b82f6',
  sadness: '#94a3b8',
  fear: '#8b5cf6',
  anger: '#ef4444'
};

const EmotionChart: React.FC = () => {
  const { metrics, isAnalyzing } = useAudioAnalysis();
  
  const data = [
    { name: 'Joy', value: metrics.emotionTraits.joy, color: COLORS.joy },
    { name: 'Surprise', value: metrics.emotionTraits.surprise, color: COLORS.surprise },
    { name: 'Sadness', value: metrics.emotionTraits.sadness, color: COLORS.sadness },
    { name: 'Fear', value: metrics.emotionTraits.fear, color: COLORS.fear },
    { name: 'Anger', value: metrics.emotionTraits.anger, color: COLORS.anger },
  ];

  if (isAnalyzing) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Emotion Traits</CardTitle>
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
        <CardTitle className="text-lg font-medium">Emotion Traits</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={70} />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(1)}%`, 'Intensity']}
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
