
import React from 'react';
import { Button } from '@/components/ui/button';
import { GaugeIcon, MapIcon, ClockIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <GaugeIcon className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-foreground">TrafficVision</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Button variant="ghost" className="text-foreground flex items-center">
              <MapIcon className="h-4 w-4 mr-2" />
              Live Map
            </Button>
            <Button variant="ghost" className="text-foreground flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Predictions
            </Button>
          </nav>
          
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Updated:</span>
            <span className="text-sm font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
