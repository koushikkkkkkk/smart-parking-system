import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, 
  Users, 
  Car, 
  BarChart3, 
  RefreshCw, 
  Play, 
  Pause,
  Zap,
  Clock,
  TrendingUp,
  MapPin
} from "lucide-react";
import { ParkingSlot } from './ParkingLot';

interface AdminPanelProps {
  onSlotUpdate?: (slots: ParkingSlot[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSlotUpdate }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  const stats = {
    totalSlots: 96,
    occupiedSlots: 67,
    reservedSlots: 12,
    availableSlots: 17,
    revenue: 2340,
    avgDuration: 2.4,
    peakHours: "2:00 PM - 6:00 PM"
  };

  const recentActivity = [
    { id: 1, action: "Vehicle entered", slot: "A1-23", time: "2 min ago", type: "entry" },
    { id: 2, action: "Slot reserved", slot: "A1-45", time: "5 min ago", type: "reservation" },
    { id: 3, action: "Vehicle exited", slot: "A1-12", time: "8 min ago", type: "exit" },
    { id: 4, action: "Payment completed", slot: "A1-67", time: "12 min ago", type: "payment" },
    { id: 5, action: "Vehicle entered", slot: "A1-89", time: "15 min ago", type: "entry" }
  ];

  const handleSimulationToggle = () => {
    setIsSimulating(!isSimulating);
    // Here you would implement the actual simulation logic
  };

  const handleRandomizeOccupancy = () => {
    // Simulate random slot changes
    const newSlots: ParkingSlot[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 12; col++) {
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
    onSlotUpdate?.(newSlots);
  };

  const occupancyRate = Math.round((stats.occupiedSlots / stats.totalSlots) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Smart Parking System Control Center</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-success text-success">
              System Online
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              Real-time
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-success/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
            <MapPin className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalSlots}</div>
            <p className="text-xs text-muted-foreground">Level A1</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Car className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.occupiedSlots}</div>
            <p className="text-xs text-muted-foreground">{occupancyRate}% full</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-warning/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.reservedSlots}</div>
            <p className="text-xs text-muted-foreground">Awaiting arrival</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${stats.revenue}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Controls */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Simulation Controls
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant={isSimulating ? "success" : "outline"}>
              {isSimulating ? "Running" : "Stopped"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant={isSimulating ? "destructive" : "neon"}
            onClick={handleSimulationToggle}
            className="flex items-center gap-2"
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4" />
                Stop Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Simulation
              </>
            )}
          </Button>

          <Button
            variant="glass"
            onClick={handleRandomizeOccupancy}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Randomize Slots
          </Button>

          <Button
            variant="ar"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <label className="text-muted-foreground">Simulation Speed</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-primary font-medium">{simulationSpeed}x</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground">Peak Hours</label>
            <p className="text-foreground font-medium">{stats.peakHours}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 glass-card border border-card-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'entry' ? 'bg-success' :
                  activity.type === 'exit' ? 'bg-destructive' :
                  activity.type === 'reservation' ? 'bg-warning' :
                  'bg-primary'
                }`} />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">Slot {activity.slot}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          System Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sensors</span>
            <Badge variant="outline" className="border-success text-success">96/96 Online</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cameras</span>
            <Badge variant="outline" className="border-success text-success">12/12 Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Network</span>
            <Badge variant="outline" className="border-success text-success">Stable</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};