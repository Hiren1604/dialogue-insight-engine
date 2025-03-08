
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';

const COLORS = ['#10b981', '#94a3b8', '#ef4444'];

const SentimentChart: React.FC = () => {
  const { metrics, isAnalyzing } = useAudioAnalysis();
  
  const data = [
    { name: 'Positive', value: metrics.sentiment.positive },
    { name: 'Neutral', value: metrics.sentiment.neutral },
    { name: 'Negative', value: metrics.sentiment.negative },
  ];

  if (isAnalyzing) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sentiment Distribution</CardTitle>
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
        <CardTitle className="text-lg font-medium">Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
