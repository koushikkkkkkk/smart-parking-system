import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Navigation, MapPin, Clock, Zap } from "lucide-react";

export interface ParkingSlot {
  id: string;
  row: number;
  col: number;
  status: 'available' | 'occupied' | 'reserved';
  vehicleType?: 'car' | 'bike' | 'truck';
  reservedBy?: string;
  reservedAt?: Date;
}

interface ParkingLotProps {
  onSlotSelect?: (slot: ParkingSlot) => void;
  selectedSlot?: ParkingSlot | null;
  userVehicle?: ParkingSlot | null;
  showRoute?: boolean;
  onSlotConfirm?: (slot: ParkingSlot) => void;
  onSlotCancel?: () => void;
}

const ROWS = 8;
const COLS = 12;
const ENTRY_POINT = { row: 0, col: 0 };

export const ParkingLot: React.FC<ParkingLotProps> = ({
  onSlotSelect,
  selectedSlot,
  userVehicle,
  showRoute = false,
  onSlotConfirm,
  onSlotCancel
}) => {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [pendingSlot, setPendingSlot] = useState<ParkingSlot | null>(null);

  // Initialize parking lot with random occupancy
  useEffect(() => {
    const initializeSlots = () => {
      const newSlots: ParkingSlot[] = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          // Skip navigation paths (every 3rd row)
          if (row % 3 === 2) continue;
          
          const random = Math.random();
          let status: 'available' | 'occupied' | 'reserved' = 'available';
          
          if (random < 0.3) status = 'occupied';
          else if (random < 0.35) status = 'reserved';
          
          newSlots.push({
            id: `${row}-${col}`,
            row,
            col,
            status,
            vehicleType: status !== 'available' ? 'car' : undefined
          });
        }
      }
      setSlots(newSlots);
    };

    initializeSlots();
  }, []);

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === 'available') {
      setPendingSlot(slot);
    }
  };

  const handleConfirmSlot = () => {
    if (pendingSlot && onSlotConfirm) {
      onSlotConfirm(pendingSlot);
      setPendingSlot(null);
    }
  };

  const handleCancelSlot = () => {
    setPendingSlot(null);
    onSlotCancel?.();
  };

  const getSlotStatus = (slot: ParkingSlot) => {
    if (userVehicle?.id === slot.id) return 'user-vehicle';
    if (selectedSlot?.id === slot.id) return 'selected';
    if (pendingSlot?.id === slot.id) return 'pending';
    return slot.status;
  };

  const getRouteSteps = () => {
    if (!selectedSlot) return [];
    
    const steps = [];
    // Simple pathfinding from entry to selected slot
    const targetRow = selectedSlot.row;
    const targetCol = selectedSlot.col;
    
    // Move horizontally first, then vertically
    for (let col = ENTRY_POINT.col; col <= targetCol; col += 2) {
      steps.push({ row: ENTRY_POINT.row, col });
    }
    
    for (let row = ENTRY_POINT.row + 2; row <= targetRow; row += 3) {
      steps.push({ row, col: targetCol });
    }
    
    return steps;
  };

  const routeSteps = showRoute ? getRouteSteps() : [];

  const getSlotStyle = (slot: ParkingSlot) => {
    const status = getSlotStatus(slot);
    const baseClasses = "w-12 h-8 m-1 rounded-lg transition-all duration-300 cursor-pointer transform relative";
    
    switch (status) {
      case 'available':
        return `${baseClasses} slot-available hover:scale-105`;
      case 'occupied':
        return `${baseClasses} slot-occupied cursor-not-allowed`;
      case 'reserved':
        return `${baseClasses} slot-reserved cursor-not-allowed`;
      case 'selected':
        return `${baseClasses} slot-selected`;
      case 'pending':
        return `${baseClasses} slot-selected`;
      case 'user-vehicle':
        return `${baseClasses} slot-user-vehicle`;
      default:
        return baseClasses;
    }
  };

  // Generate curved route path
  const generateRoutePath = () => {
    if (!selectedSlot) return '';
    
    const entryX = 20;
    const entryY = 60;
    const targetX = (selectedSlot.col * 60) + 50;
    const targetY = (selectedSlot.row * 40) + 100;
    
    // Create a curved path using cubic bezier
    const midX = (entryX + targetX) / 2;
    const midY = entryY + 50;
    
    return `M ${entryX} ${entryY} Q ${midX} ${midY} ${targetX} ${targetY}`;
  };

  const statistics = {
    total: slots.length,
    available: slots.filter(s => s.status === 'available').length,
    occupied: slots.filter(s => s.status === 'occupied').length,
    reserved: slots.filter(s => s.status === 'reserved').length
  };

  const occupancyRate = Math.round(((statistics.occupied + statistics.reserved) / statistics.total) * 100);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Statistics Header */}
      <div className="glass-card p-4 mb-4 slide-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Smart Parking Lot A1
          </h2>
          <Badge variant="outline" className="text-primary border-primary">
            {occupancyRate}% Occupied
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success"></div>
            <span>Available: {statistics.available}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span>Occupied: {statistics.occupied}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning"></div>
            <span>Reserved: {statistics.reserved}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            <span>Real-time</span>
          </div>
        </div>
      </div>

      {/* Parking Grid */}
      <div className="glass-card p-6 flex-1 overflow-auto">
        <div className="relative">
          {/* Entry Point */}
          <div className="absolute -top-8 left-0 flex items-center gap-2 text-primary text-sm font-medium">
            <Navigation className="w-4 h-4" />
            Entry Point
          </div>
          
          {/* Route SVG Overlay */}
          {showRoute && selectedSlot && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ top: 0, left: 0 }}
            >
              <path
                d={generateRoutePath()}
                className="route-line"
              />
              {/* Route dots for visual enhancement */}
              <circle cx="20" cy="60" r="4" className="route-dot" />
              <circle cx={(selectedSlot.col * 60) + 50} cy={(selectedSlot.row * 40) + 100} r="4" className="route-dot" />
            </svg>
          )}
          
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {Array.from({ length: ROWS }, (_, row) => (
              <React.Fragment key={row}>
                {row % 3 === 2 ? (
                  // Navigation path row
                  <div className="col-span-full h-8 nav-lane rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                    <Car className="w-4 h-4 mr-2" />
                    <span className="font-medium">Navigation Lane {Math.floor(row / 3) + 1}</span>
                  </div>
                ) : (
                  // Parking slot rows
                  Array.from({ length: COLS }, (_, col) => {
                    const slot = slots.find(s => s.row === row && s.col === col);
                    if (!slot) return <div key={col} className="w-12 h-8 m-1"></div>;
                    
                    const isOnRoute = routeSteps.some(step => step.row === row && step.col === col);
                    
                    return (
                      <div
                        key={slot.id}
                        className={getSlotStyle(slot)}
                        onClick={() => handleSlotClick(slot)}
                        onMouseEnter={() => setHoveredSlot(slot.id)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        title={`Slot ${slot.id} - ${slot.status}`}
                      >
                        {/* Route indicator */}
                        {isOnRoute && showRoute && (
                          <div className="absolute inset-0 border-2 border-primary rounded-lg bg-primary/20 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer_1s_ease-in-out_infinite]"></div>
                          </div>
                        )}
                        
                        {/* Slot content */}
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                          {slot.status === 'occupied' && <Car className="w-3 h-3" />}
                          {slot.status === 'reserved' && <Clock className="w-3 h-3" />}
                          {slot.status === 'available' && (
                            <span className="text-success-foreground font-bold">
                              {slot.id.split('-')[1]}
                            </span>
                          )}
                          {getSlotStatus(slot) === 'user-vehicle' && <Car className="w-3 h-3 text-secondary-foreground" />}
                          {getSlotStatus(slot) === 'pending' && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Slot Confirmation Panel */}
      {pendingSlot && (
        <div className="confirm-panel p-6 mt-4 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-foreground">Confirm Parking Slot</h3>
            <p className="text-muted-foreground">
              You've selected slot <span className="text-primary font-bold">{pendingSlot.id}</span>
            </p>
          </div>
          
          <div className="glass-card p-4 border border-primary/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Slot ID:</span>
                <span className="font-medium text-primary">{pendingSlot.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">A1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Distance:</span>
                <span className="font-medium">~{Math.floor(Math.random() * 50) + 20}m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ETA:</span>
                <span className="font-medium">~2 min</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="lg" 
              className="flex-1"
              onClick={handleCancelSlot}
            >
              Cancel
            </Button>
            <Button 
              variant="neon" 
              size="lg" 
              className="flex-1 pulse-glow"
              onClick={handleConfirmSlot}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Confirm & Navigate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};