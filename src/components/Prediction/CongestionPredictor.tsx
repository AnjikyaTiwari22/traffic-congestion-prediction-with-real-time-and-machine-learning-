
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getPredictedTrafficData, 
  TrafficData, 
  CongestionLevel,
  getRouteTrafficData
} from '@/services/trafficService';
import { 
  getPredictionConfidence, 
  getPredictionDescription,
  getCongestionTextColor
} from '@/utils/predictionUtils';
import { TrendingUpIcon, TrendingDownIcon, GaugeIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CongestionPredictorProps {
  selectedRoute?: { source: string; destination: string } | null;
}

const CongestionPredictor: React.FC<CongestionPredictorProps> = ({ selectedRoute }) => {
  const [predictionHours, setPredictionHours] = useState(1);
  const [predictedData, setPredictedData] = useState<TrafficData[]>([]);
  
  useEffect(() => {
    // Update predictions when route or time changes
    if (selectedRoute) {
      // Get route-specific predictions
      const routeData = getRouteTrafficData(
        selectedRoute.source, 
        selectedRoute.destination, 
        predictionHours
      );
      setPredictedData(routeData);
    } else {
      // Get general predictions
      setPredictedData(getPredictedTrafficData(predictionHours));
    }
  }, [predictionHours, selectedRoute]);
  
  const handlePredictionChange = (value: number[]) => {
    const hours = value[0];
    setPredictionHours(hours);
  };
  
  const confidence = getPredictionConfidence(predictionHours);
  const description = getPredictionDescription(predictedData);
  
  // Calculate dominant congestion level
  const congestionCounts = predictedData.reduce((acc, item) => {
    acc[item.congestionLevel] = (acc[item.congestionLevel] || 0) + 1;
    return acc;
  }, {} as Record<CongestionLevel, number>);
  
  const dominantLevel = Object.entries(congestionCounts).length > 0
    ? Object.entries(congestionCounts).sort((a, b) => b[1] - a[1])[0][0] as CongestionLevel
    : 'MODERATE' as CongestionLevel;
  
  // Average speed
  const avgSpeed = predictedData.length > 0
    ? Math.round(
        predictedData.reduce((sum, item) => sum + item.speedKmh, 0) / predictedData.length
      )
    : 0;
  
  const predictionDate = new Date();
  predictionDate.setHours(predictionDate.getHours() + predictionHours);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <GaugeIcon className="h-5 w-5 mr-2 text-primary" />
          {selectedRoute 
            ? "Route Traffic Prediction" 
            : "Traffic Prediction Engine"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Prediction timeframe</span>
              <Badge variant="outline">
                {predictionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            </div>
            <Slider 
              defaultValue={[1]} 
              max={12} 
              step={1} 
              min={1}
              onValueChange={handlePredictionChange}
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>1 hour</span>
              <span>6 hours</span>
              <span>12 hours</span>
            </div>
          </div>
          
          {selectedRoute && (
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="text-xs text-muted-foreground font-medium">
                Route Analysis
              </div>
              <div className="text-sm">
                {selectedRoute.source} → {selectedRoute.destination}
              </div>
            </div>
          )}
          
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className={`text-lg font-medium ${getCongestionTextColor(dominantLevel)}`}>
                  {dominantLevel} Traffic
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold flex items-center">
                  {avgSpeed} 
                  <span className="text-sm font-normal ml-1">km/h</span>
                </div>
                <div className="text-xs text-muted-foreground">Avg. Speed</div>
              </div>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>ML Prediction Confidence</span>
                <span>{Math.round(confidence * 100)}%</span>
              </div>
              <Progress value={confidence * 100} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(congestionCounts).map(([level, count]) => {
              const percentage = Math.round((count / predictedData.length) * 100);
              if (percentage < 5) return null; // Don't show very small segments
              
              return (
                <div key={level} className="prediction-card bg-white rounded-md border p-3">
                  <div className="flex justify-between items-start">
                    <div className={`${getCongestionTextColor(level as CongestionLevel)} font-medium`}>
                      {level}
                    </div>
                    <Badge variant="outline">{percentage}%</Badge>
                  </div>
                  <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
                    <span>{count} road segments</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex space-x-2">
            <Button className="w-full" size="sm">
              <TrendingUpIcon className="h-4 w-4 mr-2" />
              View Detailed Analysis
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <TrendingDownIcon className="h-4 w-4 mr-2" />
              Compare Historical
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CongestionPredictor;
