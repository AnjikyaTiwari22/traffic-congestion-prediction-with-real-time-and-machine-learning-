
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPinIcon, NavigationIcon, Loader2Icon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface LocationSearchProps {
  onSearch: (source: string, destination: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!source || !destination) {
      toast.error("Please enter both source and destination locations");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      onSearch(source, destination);
      setIsLoading(false);
      toast.success("Traffic prediction complete", {
        description: `Route: ${source} to ${destination}`
      });
    }, 1500);
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <Input
              placeholder="Enter source location"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="flex-1"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <NavigationIcon className="h-5 w-5 text-primary" />
            <Input
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Predict Traffic"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default LocationSearch;
