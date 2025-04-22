
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrafficData } from '@/services/trafficService';
import { MapIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TrafficMapProps {
  trafficData: TrafficData[];
  title?: string;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ trafficData, title = "Indore Traffic Map" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map - Replace with your Mapbox token
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [75.8577, 22.7196], // Indore coordinates
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when traffic data changes
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers
    trafficData.forEach((data) => {
      const el = document.createElement('div');
      el.className = 'traffic-marker';
      el.style.backgroundColor = getCongestionColor(data);
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';

      new mapboxgl.Marker(el)
        .setLngLat([data.location.lng, data.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h3>${data.roadName}</h3>
               <p>Speed: ${data.speedKmh} km/h</p>
               <p>Status: ${data.congestionLevel}</p>`
            )
        )
        .addTo(map.current);
    });
  }, [trafficData]);

  const getCongestionColor = (data: TrafficData) => {
    switch (data.congestionLevel) {
      case 'FREE': return '#22c55e';
      case 'LIGHT': return '#eab308';
      case 'MODERATE': return '#f97316';
      case 'HEAVY': return '#ef4444';
      case 'SEVERE': return '#7f1d1d';
      default: return '#71717a';
    }
  };
  
  return (
    <Card className="h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MapIcon className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="relative w-full h-[400px] rounded-md overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficMap;
