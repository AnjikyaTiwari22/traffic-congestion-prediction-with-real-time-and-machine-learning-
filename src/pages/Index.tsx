
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [traffic, setTraffic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulated traffic prediction function (replace with real API if available)
  const predictTraffic = async () => {
    if (!from || !to) {
      setTraffic("Please enter both locations.");
      return;
    }
    setLoading(true);
    setTraffic(null);

    // Fake a delay for "prediction"
    setTimeout(() => {
      // Fake congestion levels
      const predictions = [
        "Light traffic (green)",
        "Moderate traffic (yellow)",
        "Heavy traffic (orange)",
        "Severe traffic (red)",
      ];
      const trafficLevel = predictions[Math.floor(Math.random() * predictions.length)];
      setTraffic(`Traffic prediction from "${from}" to "${to}": ${trafficLevel}`);
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow p-8 rounded-xl w-full max-w-md flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Traffic Predictor for Indore</h1>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Start location"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Destination"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <Button
          className="w-full mt-2"
          onClick={predictTraffic}
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Traffic"}
        </Button>

        {traffic && (
          <div className="w-full bg-gray-100 mt-4 px-4 py-3 rounded text-center text-sm text-gray-700">
            {traffic}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
