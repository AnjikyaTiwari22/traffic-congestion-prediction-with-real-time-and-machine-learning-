
import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrafficData } from '@/services/trafficService';
import { MapIcon, AlertCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TrafficMapProps {
  trafficData: TrafficData[];
  title?: string;
  mapRef?: React.RefObject<any>;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ 
  trafficData, 
  title = "Indore Traffic Map",
  mapRef
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = React.useState<string | null>(
    localStorage.getItem('mapbox_token')
  );
  const [showTokenInput, setShowTokenInput] = React.useState(!mapboxToken);

  useImperativeHandle(mapRef, () => ({
    flyTo: (location: { lat: number, lng: number }) => {
      if (mapInstance.current) {
        mapInstance.current.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
          essential: true
        });
      }
    }
  }));

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const token = (form.elements.namedItem('token') as HTMLInputElement).value;
    
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
      setShowTokenInput(false);
      initializeMap(token);
    }
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [75.8577, 22.7196], // Indore coordinates
      zoom: 12
    });

    mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstance.current.on('load', () => {
      updateTrafficMarkers();
    });
  };

  const updateTrafficMarkers = () => {
    if (!mapInstance.current) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers for traffic data
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
        .addTo(mapInstance.current!);
    });
  };

  useEffect(() => {
    if (mapboxToken && !mapInstance.current) {
      initializeMap(mapboxToken);
    }
    
    return () => {
      mapInstance.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (mapInstance.current && mapInstance.current.loaded()) {
      updateTrafficMarkers();
    }
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
        {trafficData.length > 0 && (
          <Badge variant="outline">{trafficData.length} segments</Badge>
        )}
      </div>
      <CardContent className="p-4">
        {showTokenInput ? (
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center mb-3">
              <AlertCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium">Mapbox Token Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Please enter your Mapbox public token to display the map. You can get one at{' '}
              <a 
                href="https://mapbox.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </p>
            <form onSubmit={handleTokenSubmit} className="space-y-2">
              <input
                type="text"
                name="token"
                placeholder="pk.eyJ1IjoieW91..."
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 w-full"
              >
                Set Token
              </button>
            </form>
          </div>
        ) : (
          <div className="relative w-full h-[400px] rounded-md overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficMap;
