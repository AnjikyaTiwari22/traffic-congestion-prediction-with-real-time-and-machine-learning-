
import { CongestionLevel, TrafficData } from "../services/trafficService";

// Mock ML prediction confidence
export const getPredictionConfidence = (hoursInFuture: number): number => {
  // In real ML systems, confidence typically decreases as we predict further into the future
  // This is a simplified model that returns lower confidence for predictions further in the future
  const baseConfidence = 0.95; // 95% confidence for immediate predictions
  const confidenceDecay = 0.05 * hoursInFuture; // 5% confidence loss per hour
  
  return Math.max(0.5, baseConfidence - confidenceDecay); // Minimum 50% confidence
};

// Get a textual description of the predicted traffic
export const getPredictionDescription = (data: TrafficData[]): string => {
  // Count congestion levels
  const counts = {
    [CongestionLevel.FREE]: 0,
    [CongestionLevel.LIGHT]: 0,
    [CongestionLevel.MODERATE]: 0,
    [CongestionLevel.HEAVY]: 0,
    [CongestionLevel.SEVERE]: 0
  };
  
  data.forEach(item => {
    counts[item.congestionLevel]++;
  });
  
  // Determine the dominant congestion level
  const total = data.length;
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as CongestionLevel;
  
  // Generate description based on dominant congestion level
  switch(dominant) {
    case CongestionLevel.FREE:
      return "Traffic is flowing freely with minimal congestion expected.";
    case CongestionLevel.LIGHT:
      return "Light traffic conditions predicted with good overall flow.";
    case CongestionLevel.MODERATE:
      return "Moderate traffic expected with some congestion in key areas.";
    case CongestionLevel.HEAVY:
      return "Heavy traffic predicted with significant delays likely.";
    case CongestionLevel.SEVERE:
      return "Severe congestion expected with major delays and potential gridlock.";
    default:
      return "Unable to determine traffic conditions.";
  }
};

// Get the color for a specific congestion level
export const getCongestionColor = (level: CongestionLevel): string => {
  switch(level) {
    case CongestionLevel.FREE:
      return 'bg-traffic-free';
    case CongestionLevel.LIGHT:
      return 'bg-green-400';
    case CongestionLevel.MODERATE:
      return 'bg-traffic-moderate';
    case CongestionLevel.HEAVY:
      return 'bg-traffic-heavy';
    case CongestionLevel.SEVERE:
      return 'bg-red-700';
    default:
      return 'bg-gray-400';
  }
};

// Get the text color for a specific congestion level
export const getCongestionTextColor = (level: CongestionLevel): string => {
  switch(level) {
    case CongestionLevel.FREE:
    case CongestionLevel.LIGHT:
      return 'text-traffic-free';
    case CongestionLevel.MODERATE:
      return 'text-traffic-moderate';
    case CongestionLevel.HEAVY:
    case CongestionLevel.SEVERE:
      return 'text-traffic-heavy';
    default:
      return 'text-gray-400';
  }
};

// Calculate prediction accuracy for historical data
export const calculateHistoricalAccuracy = (): number => {
  // In a real app, this would compare past predictions with actual data
  // For demo purposes, return a realistic but random accuracy
  return 0.78 + Math.random() * 0.12; // Between 78% and 90%
};
