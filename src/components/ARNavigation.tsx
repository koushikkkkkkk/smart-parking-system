import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Navigation, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  MapPin, 
  Clock, 
  CheckCircle,
  Camera,
  Scan
} from "lucide-react";
import { ParkingSlot } from './ParkingLot';

interface ARNavigationProps {
  targetSlot: ParkingSlot | null;
  userVehicle?: ParkingSlot | null;
  onComplete?: () => void;
  onCancel?: () => void;
  mode: 'to-slot' | 'to-car';
}

interface NavigationStep {
  instruction: string;
  direction: 'forward' | 'left' | 'right' | 'arrived';
  distance: number;
  icon: React.ReactNode;
}

export const ARNavigation: React.FC<ARNavigationProps> = ({
  targetSlot,
  userVehicle,
  onComplete,
  onCancel,
  mode
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const target = mode === 'to-slot' ? targetSlot : userVehicle;
  
  const navigationSteps: NavigationStep[] = [
    {
      instruction: "Head straight towards the parking lanes",
      direction: "forward",
      distance: 50,
      icon: <ArrowUp className="w-5 h-5" />
    },
    {
      instruction: "Turn right at the navigation lane",
      direction: "right", 
      distance: 30,
      icon: <ArrowRight className="w-5 h-5" />
    },
    {
      instruction: "Continue straight down the lane",
      direction: "forward",
      distance: 40,
      icon: <ArrowUp className="w-5 h-5" />
    },
    {
      instruction: mode === 'to-slot' ? `Slot ${target?.id} is on your left` : "Your vehicle is on the left",
      direction: "left",
      distance: 10,
      icon: <ArrowLeft className="w-5 h-5" />
    },
    {
      instruction: mode === 'to-slot' ? "You have arrived at your parking slot!" : "You have reached your vehicle!",
      direction: "arrived",
      distance: 0,
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    if (isNavigating) {
      const timer = setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(prev => {
              if (prev < navigationSteps.length - 1) {
                return prev + 1;
              }
              return prev;
            });
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isNavigating, currentStep]);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
    setSimulatedProgress(0);
  };

  const handleCompleteNavigation = () => {
    setIsNavigating(false);
    onComplete?.();
  };

  const currentInstruction = navigationSteps[currentStep];
  const isArrived = currentStep === navigationSteps.length - 1 && simulatedProgress >= 100;

  return (
    <div className="ar-overlay flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 space-y-6 slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Camera className="w-6 h-6" />
            <h2 className="text-xl font-bold">AR Navigation</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === 'to-slot' ? 'Navigate to your parking slot' : 'Find your parked vehicle'}
          </p>
        </div>

        {/* Target Info */}
        <div className="glass-card p-4 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {mode === 'to-slot' ? 'Destination' : 'Your Vehicle'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Slot {target?.id}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Level A1
            </Badge>
          </div>
        </div>

        {/* Navigation Status */}
        {!isNavigating ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Scan className="w-12 h-12 text-primary mx-auto pulse-glow" />
              <p className="text-sm text-muted-foreground">
                Point your camera forward and tap start to begin AR navigation
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="neon" 
                size="lg" 
                className="w-full"
                onClick={handleStartNavigation}
              >
                <Navigation className="w-5 h-5 mr-2" />
                Start AR Navigation
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Instruction */}
            <div className="glass-card p-4 border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                  {currentInstruction.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {currentInstruction.instruction}
                  </p>
                  {currentInstruction.distance > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentInstruction.distance}m ahead
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {navigationSteps.length}
                </span>
                <span className="text-primary">
                  {Math.round(simulatedProgress)}%
                </span>
              </div>
              
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep * 100 + simulatedProgress) / navigationSteps.length}%` }}
                />
              </div>
            </div>

            {/* ETA */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>ETA: {Math.max(1, Math.ceil((navigationSteps.length - currentStep) * 0.5))} min</span>
            </div>

            {/* Complete Button */}
            {isArrived && (
              <Button 
                variant="success" 
                size="lg" 
                className="w-full pulse-glow"
                onClick={handleCompleteNavigation}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {mode === 'to-slot' ? 'Park Here' : 'Found Vehicle'}
              </Button>
            )}

            {/* Cancel Navigation */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={onCancel}
            >
              Cancel Navigation
            </Button>
          </div>
        )}

        {/* AR Simulation Overlay */}
        {isNavigating && (
          <div className="fixed inset-0 pointer-events-none">
            {/* Simulated AR Elements */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 border-4 border-primary rounded-full flex items-center justify-center pulse-glow">
                {currentInstruction.icon}
              </div>
            </div>
            
            {/* Distance indicator */}
            {currentInstruction.distance > 0 && (
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2">
                <p className="text-primary font-bold text-lg">
                  {currentInstruction.distance}m
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};