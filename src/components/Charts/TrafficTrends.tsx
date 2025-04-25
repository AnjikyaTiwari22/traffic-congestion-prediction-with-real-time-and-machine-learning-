
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  TooltipProps
} from 'recharts';
import { getHistoricalTrafficData, CongestionLevel } from '@/services/trafficService';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

const TrafficTrends: React.FC = () => {
  // Process historical data for charts
  const historicalData = getHistoricalTrafficData();
  
  // Prepare data for speed trend chart (average speed over time)
  const speedTrendData = historicalData.map(snapshot => {
    const avgSpeed = snapshot.data.reduce((sum, item) => sum + item.speedKmh, 0) / snapshot.data.length;
    
    return {
      time: new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avgSpeed: Math.round(avgSpeed),
      timestamp: snapshot.timestamp
    };
  });
  
  // Prepare data for congestion distribution chart
  const congestionDistributionData = historicalData.map(snapshot => {
    const congestionCounts = {
      [CongestionLevel.FREE]: 0,
      [CongestionLevel.LIGHT]: 0,
      [CongestionLevel.MODERATE]: 0,
      [CongestionLevel.HEAVY]: 0,
      [CongestionLevel.SEVERE]: 0
    };
    
    snapshot.data.forEach(item => {
      congestionCounts[item.congestionLevel]++;
    });
    
    const total = snapshot.data.length;
    
    return {
      time: new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      free: (congestionCounts[CongestionLevel.FREE] / total) * 100,
      light: (congestionCounts[CongestionLevel.LIGHT] / total) * 100,
      moderate: (congestionCounts[CongestionLevel.MODERATE] / total) * 100,
      heavy: (congestionCounts[CongestionLevel.HEAVY] / total) * 100,
      severe: (congestionCounts[CongestionLevel.SEVERE] / total) * 100,
      timestamp: snapshot.timestamp
    };
  });
  
  // Filter for showing only some data points to avoid overcrowding
  const filteredSpeedTrendData = speedTrendData.filter((_, index) => index % 3 === 0);
  const filteredCongestionData = congestionDistributionData.filter((_, index) => index % 3 === 0);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Traffic Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="speed">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="speed">Speed Trends</TabsTrigger>
            <TabsTrigger value="congestion">Congestion Levels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="speed" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredSpeedTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Avg. Speed (km/h)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: '12px' }
                  }}
                />
                <Tooltip 
                  formatter={(value: ValueType) => {
                    if (typeof value === 'number') {
                      return [`${value} km/h`, 'Avg. Speed'];
                    }
                    return [`${value}`, 'Avg. Speed'];
                  }}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="avgSpeed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="congestion" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredCongestionData} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: ValueType) => {
                    if (typeof value === 'number') {
                      return [`${Math.round(value)}%`, ''];
                    }
                    return [`${value}`, ''];
                  }}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Bar dataKey="free" name="Free" stackId="a" fill="hsl(var(--traffic-free))" />
                <Bar dataKey="light" name="Light" stackId="a" fill="#4ade80" />
                <Bar dataKey="moderate" name="Moderate" stackId="a" fill="hsl(var(--traffic-moderate))" />
                <Bar dataKey="heavy" name="Heavy" stackId="a" fill="hsl(var(--traffic-heavy))" />
                <Bar dataKey="severe" name="Severe" stackId="a" fill="#b91c1c" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrafficTrends;
