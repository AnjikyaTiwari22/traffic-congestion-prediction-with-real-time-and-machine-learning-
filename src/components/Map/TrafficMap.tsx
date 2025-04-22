import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrafficData, CongestionLevel } from '@/services/trafficService';
import { getCongestionColor } from '@/utils/predictionUtils';
import { MapIcon } from 'lucide-react';

interface TrafficMapProps {
  trafficData: TrafficData[];
  title?: string;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ trafficData, title = "Indore Traffic Map" }) => {
  // In a real app, this would use an actual map library like Mapbox, Google Maps, etc.
  // For this demo, we'll create a simplified visual representation
  
  return (
    <Card className="h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MapIcon className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <div className="flex space-x-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-traffic-free mr-1"></div>
            <span>Free</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-traffic-moderate mr-1"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-traffic-heavy mr-1"></div>
            <span>Heavy</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="relative w-full h-[400px] bg-slate-100 rounded-md overflow-hidden">
          {/* Map visualization placeholder */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <span className="text-sm">Interactive map will appear here</span>
            </div>
            
            {/* Traffic indicators */}
            {trafficData.map((data) => {
              // Calculate position based on lat/lng (simplified for demo)
              const left = ((data.location.lng + 180) / 360) * 100;
              const top = ((90 - data.location.lat) / 180) * 100;
              
              return (
                <div 
                  key={data.id}
                  className={`absolute w-12 h-4 rounded traffic-pulse ${getCongestionColor(data.congestionLevel)}`}
                  style={{ 
                    left: `${left}%`, 
                    top: `${top}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${data.roadName}: ${data.speedKmh} km/h`}
                >
                  <div className="text-xs text-white text-center font-semibold">
                    {data.speedKmh}
                  </div>
                </div>
              );
            })}
            
            {/* Road names */}
            {trafficData.map((data) => {
              const left = ((data.location.lng + 180) / 360) * 100;
              const top = ((90 - data.location.lat) / 180) * 100;
              
              return (
                <div 
                  key={`label-${data.id}`}
                  className="absolute text-xs font-medium bg-white bg-opacity-70 px-1 rounded"
                  style={{ 
                    left: `${left}%`, 
                    top: `${top + 3}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {data.roadName}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficMap;
