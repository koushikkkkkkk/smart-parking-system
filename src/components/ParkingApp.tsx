import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ParkingLot, ParkingSlot } from './ParkingLot';
import { ARNavigation } from './ARNavigation';
import { AdminPanel } from './AdminPanel';
import { 
  ArrowLeft, 
  Settings, 
  Navigation, 
  Car, 
  Clock,
  Shield,
  Menu
} from "lucide-react";

type AppState = 'parking' | 'ar-navigation' | 'admin' | 'parked';

export const ParkingApp: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('parking');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [userVehicle, setUserVehicle] = useState<ParkingSlot | null>(null);
  const [navigationMode, setNavigationMode] = useState<'to-slot' | 'to-car'>('to-slot');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
  };

  const handleStartNavigation = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setNavigationMode('to-slot');
    setCurrentState('ar-navigation');
  };

  const handleNavigationComplete = () => {
    if (navigationMode === 'to-slot' && selectedSlot) {
      // User has parked
      setUserVehicle(selectedSlot);
      setCurrentState('parked');
    } else {
      // User found their car
      setCurrentState('parking');
      setUserVehicle(null);
    }
    setSelectedSlot(null);
  };

  const handleFindCar = () => {
    if (userVehicle) {
      setNavigationMode('to-car');
      setCurrentState('ar-navigation');
    }
  };

  const handleBackToParkingLot = () => {
    setCurrentState('parking');
    setSelectedSlot(null);
  };

  const renderHeader = () => (
    <div className="glass-card p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {currentState !== 'parking' && currentState !== 'admin' && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackToParkingLot}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground">Smart Parking</h1>
          <p className="text-sm text-muted-foreground">
            {currentState === 'parking' && 'Select a parking slot'}
            {currentState === 'ar-navigation' && `AR Navigation ${navigationMode === 'to-slot' ? 'to Slot' : 'to Vehicle'}`}
            {currentState === 'admin' && 'Admin Dashboard'}
            {currentState === 'parked' && 'Vehicle Parked'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {userVehicle && currentState === 'parking' && (
            <Button
              variant="ar"
              size="sm"
              onClick={handleFindCar}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Find My Car
            </Button>
          )}
          
          <Button
            variant={currentState === 'admin' ? 'neon' : 'ghost'}
            size="icon"
            onClick={() => setCurrentState(currentState === 'admin' ? 'parking' : 'admin')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-4 z-50 md:hidden">
          <div className="space-y-2">
            {userVehicle && currentState === 'parking' && (
              <Button
                variant="ar"
                size="sm"
                onClick={handleFindCar}
                className="w-full flex items-center gap-2"
              >
                <Car className="w-4 h-4" />
                Find My Car
              </Button>
            )}
            
            <Button
              variant={currentState === 'admin' ? 'neon' : 'ghost'}
              size="sm"
              onClick={() => setCurrentState(currentState === 'admin' ? 'parking' : 'admin')}
              className="w-full flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderParkedStatus = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-success/20 rounded-2xl flex items-center justify-center">
          <Car className="w-10 h-10 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-success">Vehicle Parked!</h2>
          <p className="text-muted-foreground">Your vehicle is safely parked in slot {userVehicle?.id}</p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Parking Slot</span>
          <span className="font-medium text-primary">Slot {userVehicle?.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Parked Since</span>
          <span className="font-medium">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Level</span>
          <span className="font-medium">A1</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="neon"
          size="lg"
          className="w-full"
          onClick={handleFindCar}
        >
          <Navigation className="w-5 h-5 mr-2" />
          Find My Car (AR Navigation)
        </Button>
        
        <Button
          variant="glass"
          size="lg"
          className="w-full"
          onClick={() => setCurrentState('parking')}
        >
          View Parking Lot
        </Button>
      </div>

      <div className="glass-card p-4 border-l-4 border-l-warning">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-warning">Parking Session Active</p>
            <p className="text-sm text-muted-foreground">
              Remember to return before your session expires to avoid additional charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      {/* Security Overlay - Simulated */}
      <div className="fixed top-4 right-4 z-50">
        <div className="glass-card px-3 py-2 flex items-center gap-2 text-xs">
          <Shield className="w-3 h-3 text-success" />
          <span className="text-success">Secure Connection</span>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {renderHeader()}

        <div className="relative">
          {currentState === 'parking' && (
            <ParkingLot
              onSlotSelect={handleStartNavigation}
              selectedSlot={selectedSlot}
              userVehicle={userVehicle}
              showRoute={false}
            />
          )}

          {currentState === 'ar-navigation' && (
            <ARNavigation
              targetSlot={navigationMode === 'to-slot' ? selectedSlot : null}
              userVehicle={navigationMode === 'to-car' ? userVehicle : null}
              mode={navigationMode}
              onComplete={handleNavigationComplete}
              onCancel={handleBackToParkingLot}
            />
          )}

          {currentState === 'admin' && (
            <AdminPanel />
          )}

          {currentState === 'parked' && (
            <div className="max-w-md mx-auto">
              {renderParkedStatus()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};