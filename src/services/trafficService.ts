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
  // Major roads in Indore
  const locations = [
    { roadName: "MG Road", lat: 22.7196, lng: 75.8577 },
    { roadName: "AB Road", lat: 22.7244, lng: 75.8839 },
    { roadName: "Ring Road", lat: 22.7468, lng: 75.8980 },
    { roadName: "LIG Link Road", lat: 22.7531, lng: 75.8937 },
    { roadName: "Vijay Nagar Road", lat: 22.7533, lng: 75.8937 },
    { roadName: "Race Course Road", lat: 22.7234, lng: 75.8825 },
    { roadName: "Palasia Road", lat: 22.7244, lng: 75.8819 },
    { roadName: "Sapna Sangeeta Road", lat: 22.7269, lng: 75.8831 }
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

export function getRouteTrafficData(source: string, destination: string, hours: number = 0): TrafficData[] {
  // Generate fake route data between source and destination
  // This would be replaced with real API calls in a production app
  
  const roadNames = [
    "MG Road",
    "Ring Road",
    "AB Road",
    "Khandwa Road",
    "Bombay Hospital Road",
    "Indore-Ujjain Road",
    "Airport Road",
    "Annapurna Road",
    "Patnipura Road",
    "Bhawarkuan Main Road"
  ];
  
  // Generate 5-10 points along a simulated route
  const numPoints = 5 + Math.floor(Math.random() * 6);
  const result: TrafficData[] = [];
  
  // Base coordinates for Indore
  const baseLat = 22.7196;
  const baseLng = 75.8577;
  
  // Create variation along a "route"
  let currentLat = baseLat - 0.02 + Math.random() * 0.04;
  let currentLng = baseLng - 0.02 + Math.random() * 0.04;
  
  for (let i = 0; i < numPoints; i++) {
    // Move in a generally consistent direction to simulate a route
    currentLat += (Math.random() * 0.01) - 0.005;
    currentLng += (Math.random() * 0.01) - 0.005;
    
    // Different congestion levels based on time prediction
    // For future predictions, we add more severe congestion levels
    let congestionLevels: CongestionLevel[];
    if (hours > 8) {
      congestionLevels = ["MODERATE", "HEAVY", "SEVERE"];
    } else if (hours > 4) {
      congestionLevels = ["LIGHT", "MODERATE", "HEAVY"];
    } else if (hours > 0) {
      congestionLevels = ["FREE", "LIGHT", "MODERATE"];
    } else {
      congestionLevels = ["FREE", "LIGHT", "MODERATE", "HEAVY", "SEVERE"];
    }
    
    const congestionLevel = congestionLevels[Math.floor(Math.random() * congestionLevels.length)];
    const speedMap: Record<CongestionLevel, number> = {
      "FREE": 50 + Math.random() * 20,
      "LIGHT": 35 + Math.random() * 15,
      "MODERATE": 20 + Math.random() * 15,
      "HEAVY": 10 + Math.random() * 10,
      "SEVERE": 5 + Math.random() * 5
    };
    
    result.push({
      id: `route-${source}-${destination}-${i}`,
      roadName: roadNames[Math.floor(Math.random() * roadNames.length)],
      location: {
        lat: currentLat,
        lng: currentLng
      },
      congestionLevel,
      speedKmh: Math.round(speedMap[congestionLevel]),
      timestamp: new Date().getTime()
    });
  }
  
  return result;
}
