import React, { useState } from 'react';
import { QREntry } from '@/components/QREntry';
import { ParkingApp } from '@/components/ParkingApp';

const Index = () => {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEntry = () => {
    setHasEntered(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {!hasEntered ? (
        <QREntry onEntry={handleEntry} />
      ) : (
        <ParkingApp />
      )}
    </div>
  );
};

export default Index;
