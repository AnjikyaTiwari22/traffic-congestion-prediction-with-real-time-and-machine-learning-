
// Types for traffic data
export interface TrafficData {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  speedKmh: number;
  congestionLevel: CongestionLevel;
  timestamp: string;
  roadName: string;
}

export enum CongestionLevel {
  FREE = "FREE",
  LIGHT = "LIGHT",
  MODERATE = "MODERATE",
  HEAVY = "HEAVY",
  SEVERE = "SEVERE"
}

interface TrafficSnapshot {
  timestamp: string;
  data: TrafficData[];
}

// Mock data generator for current traffic
export const getCurrentTrafficData = (): TrafficData[] => {
  // For demo purposes, we'll generate random traffic data
  const locations = [
    { roadName: "Main Street", lat: 40.7128, lng: -74.0060 },
    { roadName: "Broadway", lat: 40.7589, lng: -73.9851 },
    { roadName: "Fifth Avenue", lat: 40.7536, lng: -73.9831 },
    { roadName: "Park Avenue", lat: 40.7539, lng: -73.9742 },
    { roadName: "Lexington Avenue", lat: 40.7528, lng: -73.9725 },
    { roadName: "Madison Avenue", lat: 40.7517, lng: -73.9785 },
    { roadName: "Seventh Avenue", lat: 40.7631, lng: -73.9803 },
    { roadName: "Eighth Avenue", lat: 40.7590, lng: -73.9845 }
  ];

  return locations.map((loc, index) => {
    // Generate random speed (5-80 km/h)
    const speedKmh = Math.floor(Math.random() * 75) + 5;
    
    // Determine congestion level based on speed
    let congestionLevel: CongestionLevel;
    if (speedKmh > 60) {
      congestionLevel = CongestionLevel.FREE;
    } else if (speedKmh > 45) {
      congestionLevel = CongestionLevel.LIGHT;
    } else if (speedKmh > 30) {
      congestionLevel = CongestionLevel.MODERATE;
    } else if (speedKmh > 15) {
      congestionLevel = CongestionLevel.HEAVY;
    } else {
      congestionLevel = CongestionLevel.SEVERE;
    }

    return {
      id: `traffic-${index}`,
      location: { lat: loc.lat, lng: loc.lng },
      speedKmh,
      congestionLevel,
      timestamp: new Date().toISOString(),
      roadName: loc.roadName
    };
  });
};

// Historical traffic data (past 24 hours with hourly snapshots)
export const getHistoricalTrafficData = (): TrafficSnapshot[] => {
  const snapshots: TrafficSnapshot[] = [];
  const now = new Date();
  
  // Generate data for past 24 hours
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    
    // Generate random traffic data for this timestamp
    const data: TrafficData[] = getCurrentTrafficData().map(item => ({
      ...item,
      speedKmh: Math.floor(Math.random() * 75) + 5, // Randomize speed
      timestamp: timestamp.toISOString()
    }));
    
    snapshots.push({
      timestamp: timestamp.toISOString(),
      data
    });
  }
  
  return snapshots;
};

// Function to get traffic prediction for future time
export const getPredictedTrafficData = (hoursInFuture: number): TrafficData[] => {
  // In a real app, this would use ML models to predict future traffic
  // For demo purposes, we'll create simulated prediction data

  // Get current data as baseline
  const currentData = getCurrentTrafficData();
  
  // Apply time-based patterns (rush hour, etc.) and some randomness
  const hourOfDay = (new Date().getHours() + hoursInFuture) % 24;
  
  return currentData.map(item => {
    let modifier = 1.0;
    
    // Simulate morning rush hour (7-9 AM)
    if (hourOfDay >= 7 && hourOfDay <= 9) {
      modifier = 0.6; // More congestion
    } 
    // Simulate evening rush hour (4-7 PM)
    else if (hourOfDay >= 16 && hourOfDay <= 19) {
      modifier = 0.5; // Even more congestion
    }
    // Late night (11 PM - 5 AM)
    else if (hourOfDay >= 23 || hourOfDay <= 5) {
      modifier = 1.5; // Less congestion
    }
    
    // Add some randomness
    modifier *= (0.7 + Math.random() * 0.6);
    
    // Calculate new speed
    let newSpeed = Math.floor(item.speedKmh * modifier);
    newSpeed = Math.min(Math.max(newSpeed, 5), 80); // Clamp between 5-80 km/h
    
    // Determine new congestion level
    let congestionLevel: CongestionLevel;
    if (newSpeed > 60) {
      congestionLevel = CongestionLevel.FREE;
    } else if (newSpeed > 45) {
      congestionLevel = CongestionLevel.LIGHT;
    } else if (newSpeed > 30) {
      congestionLevel = CongestionLevel.MODERATE;
    } else if (newSpeed > 15) {
      congestionLevel = CongestionLevel.HEAVY;
    } else {
      congestionLevel = CongestionLevel.SEVERE;
    }
    
    return {
      ...item,
      speedKmh: newSpeed,
      congestionLevel,
      timestamp: new Date(new Date().getTime() + hoursInFuture * 60 * 60 * 1000).toISOString()
    };
  });
};

// Function to get aggregated traffic stats
export const getTrafficStats = () => {
  const data = getCurrentTrafficData();
  
  // Count congestion levels
  const congestionCounts = {
    [CongestionLevel.FREE]: 0,
    [CongestionLevel.LIGHT]: 0,
    [CongestionLevel.MODERATE]: 0,
    [CongestionLevel.HEAVY]: 0,
    [CongestionLevel.SEVERE]: 0
  };
  
  data.forEach(item => {
    congestionCounts[item.congestionLevel]++;
  });
  
  // Calculate average speed
  const avgSpeed = data.reduce((acc, item) => acc + item.speedKmh, 0) / data.length;
  
  return {
    congestionCounts,
    avgSpeed,
    totalRoads: data.length
  };
};
