
import React, { useState, useEffect, useRef } from 'react';
import { 
  getCurrentTrafficData, 
  getTrafficStats,
  getRouteTrafficData,
  TrafficData
} from '@/services/trafficService';
import Header from '@/components/Layout/Header';
import TrafficMap from '@/components/Map/TrafficMap';
import CongestionPredictor from '@/components/Prediction/CongestionPredictor';
import LocationSearch from '@/components/Search/LocationSearch';
import TrafficTrends from '@/components/Charts/TrafficTrends';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCwIcon, DatabaseIcon, SignalIcon } from 'lucide-react';
import { calculateHistoricalAccuracy } from '@/utils/predictionUtils';
import { toast } from 'sonner';

const Index = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<{source: string, destination: string} | null>(null);
  const mapRef = useRef<any>(null);
  
  useEffect(() => {
    fetchTrafficData();
    const intervalId = setInterval(() => {
      fetchTrafficData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchTrafficData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = getCurrentTrafficData();
      setTrafficData(newData);
      setLastUpdated(new Date());
      setIsLoading(false);
      toast("Traffic data updated", {
        description: `Latest data loaded at ${new Date().toLocaleTimeString()}`,
      });
    }, 800);
  };

  const handleLocationSearch = (source: string, destination: string) => {
    // Store the selected route
    setSelectedRoute({ source, destination });
    
    // Get specific route traffic data
    const routeTrafficData = getRouteTrafficData(source, destination);
    setTrafficData(routeTrafficData);
    
    // Center map on the route (first point of route)
    if (routeTrafficData.length > 0 && mapRef.current) {
      const centerPoint = routeTrafficData[0].location;
      mapRef.current.flyTo(centerPoint);
    }
    
    toast("Route traffic predicted", {
      description: `Analyzing traffic from ${source} to ${destination}`,
    });
  };
  
  const trafficStats = getTrafficStats();
  const modelAccuracy = calculateHistoricalAccuracy();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Indore Traffic Prediction</h1>
            <p className="text-muted-foreground mt-1">
              Real-time traffic analysis for Indore city roads
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button 
              size="sm" 
              onClick={fetchTrafficData}
              disabled={isLoading}
            >
              <RefreshCwIcon className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <LocationSearch onSearch={handleLocationSearch} />
        </div>
        
        {selectedRoute && (
          <div className="mb-4">
            <Card className="bg-muted/50">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Active Route</Badge>
                  <span className="text-sm font-medium">{selectedRoute.source} → {selectedRoute.destination}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedRoute(null);
                    fetchTrafficData();
                  }}
                >
                  Clear
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-primary/10 p-3 mr-4">
                <SignalIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Speed</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{Math.round(trafficStats.avgSpeed)}</h3>
                  <span className="ml-1 text-sm text-muted-foreground">km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-secondary/10 p-3 mr-4">
                <DatabaseIcon className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ML Model Accuracy</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{Math.round(modelAccuracy * 100)}%</h3>
                  <Badge className="ml-2" variant="outline">Based on historical data</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-muted p-3 mr-4">
                <SignalIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monitored Road Segments</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{trafficStats.totalRoads}</h3>
                  <span className="ml-1 text-sm text-muted-foreground">segments</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrafficMap trafficData={trafficData} mapRef={mapRef} />
          </div>
          <div>
            <CongestionPredictor selectedRoute={selectedRoute} />
          </div>
        </div>
        
        <div className="mt-6">
          <TrafficTrends />
        </div>
      </main>
    </div>
  );
};

export default Index;
