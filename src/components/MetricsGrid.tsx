
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  BarChart, 
  AlertTriangle, 
  BadgeAlert, 
  BarChart2, 
  CheckCircle 
} from 'lucide-react';
import { useAudioAnalysis } from '@/contexts/AudioAnalysisContext';
import { Progress } from '@/components/ui/progress';

const MetricsGrid: React.FC = () => {
  const { metrics, isAnalyzing } = useAudioAnalysis();
  
  const metricsData = [
    {
      title: "Response Time",
      value: `${metrics.agentMetrics.responseTime.toFixed(1)}s`,
      icon: <Clock className="h-4 w-4" />,
      description: "Average time to respond",
      progress: (metrics.agentMetrics.responseTime / 10) * 100,
      inverted: true, // Lower is better
    },
    {
      title: "Talking Ratio",
      value: `${metrics.agentMetrics.talkingRatio.toFixed(0)}%`,
      icon: <BarChart className="h-4 w-4" />,
      description: "Agent vs Customer talking time",
      progress: metrics.agentMetrics.talkingRatio,
    },
    {
      title: "Interruptions",
      value: metrics.agentMetrics.interruptions,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Number of times agent interrupted",
      progress: (metrics.agentMetrics.interruptions / 10) * 100,
      inverted: true, // Lower is better
    },
    {
      title: "Cuss Words",
      value: metrics.agentMetrics.cussWords,
      icon: <BadgeAlert className="h-4 w-4" />,
      description: "Inappropriate language detected",
      progress: (metrics.agentMetrics.cussWords / 5) * 100,
      inverted: true, // Lower is better
    },
    {
      title: "Escalation Rate",
      value: `${metrics.agentMetrics.escalationRate.toFixed(0)}%`,
      icon: <BarChart2 className="h-4 w-4" />,
      description: "Likelihood of escalation",
      progress: metrics.agentMetrics.escalationRate,
      inverted: true, // Lower is better
    },
    {
      title: "Resolution Rate",
      value: `${metrics.agentMetrics.resolutionRate.toFixed(0)}%`,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Likelihood of resolution",
      progress: metrics.agentMetrics.resolutionRate,
    },
  ];

  const getProgressColor = (metric: typeof metricsData[0]) => {
    if (metric.inverted) {
      if (metric.progress < 33) return "bg-green-500";
      if (metric.progress < 66) return "bg-amber-500";
      return "bg-red-500";
    } else {
      if (metric.progress > 66) return "bg-green-500";
      if (metric.progress > 33) return "bg-amber-500";
      return "bg-red-500";
    }
  };

  if (isAnalyzing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="w-full h-24 animate-shimmer rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricsData.map((metric, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  {metric.icon}
                  {metric.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              <Progress value={metric.progress} className={`h-1.5 ${getProgressColor(metric)}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsGrid;
