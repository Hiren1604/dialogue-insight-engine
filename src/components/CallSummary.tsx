
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const CallSummary: React.FC = () => {
  const { metrics, isAnalyzing, isAnalysisComplete } = useAudioAnalysis();

  const getTypeLabel = () => {
    switch (metrics.conversationType) {
      case 'true-positive':
        return { color: 'bg-green-500', label: 'True Positive', icon: <CheckCircle className="h-4 w-4" /> };
      case 'true-negative':
        return { color: 'bg-amber-500', label: 'True Negative', icon: <AlertTriangle className="h-4 w-4" /> };
      case 'false-positive':
        return { color: 'bg-blue-500', label: 'False Positive', icon: <XCircle className="h-4 w-4" /> };
      case 'false-negative':
        return { color: 'bg-red-500', label: 'False Negative', icon: <XCircle className="h-4 w-4" /> };
      default:
        return { color: 'bg-gray-500', label: 'Analyzing...', icon: null };
    }
  };

  const typeInfo = getTypeLabel();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Call Summary</span>
          {isAnalysisComplete && (
            <Badge variant="outline" className={`${typeInfo.color}/10 text-${typeInfo.color.replace('bg-', '')} border-${typeInfo.color.replace('bg-', '')}/30 flex items-center gap-1.5`}>
              {typeInfo.icon}
              {typeInfo.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <>
            <div className="w-full h-4 animate-shimmer rounded mb-3"></div>
            <div className="w-full h-4 animate-shimmer rounded mb-3"></div>
            <div className="w-full h-4 animate-shimmer rounded mb-3"></div>
            <div className="w-3/4 h-4 animate-shimmer rounded"></div>
          </>
        ) : (
          <p className="text-muted-foreground">{metrics.summary || "Summary will appear here after analysis is complete."}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CallSummary;
