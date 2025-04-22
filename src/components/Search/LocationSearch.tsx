
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPinIcon, NavigationIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LocationSearchProps {
  onSearch: (source: string, destination: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch }) => {
  const [source, setSource] = React.useState('');
  const [destination, setDestination] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(source, destination);
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
            />
          </div>
          <div className="flex items-center space-x-2">
            <NavigationIcon className="h-5 w-5 text-primary" />
            <Input
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Predict Traffic
        </Button>
      </form>
    </Card>
  );
};

export default LocationSearch;
