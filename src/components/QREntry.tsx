import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Scan, Car, Smartphone, ArrowRight, Zap } from "lucide-react";

interface QREntryProps {
  onEntry?: () => void;
}

export const QREntry: React.FC<QREntryProps> = ({ onEntry }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              onEntry?.();
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isScanning, onEntry]);

  const handleScanQR = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 slide-up">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center neon-glow">
            <Car className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Parking
            </h1>
            <p className="text-muted-foreground">Futuristic Parking System</p>
          </div>
        </div>

        {/* QR Code Scanner */}
        <Card className="glass-card border-primary/30 slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Scan QR Code
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Scan the QR code at the parking entrance to begin
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Display */}
            <div className="relative">
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-2xl border-4 border-primary/20 relative overflow-hidden">
                {/* QR Code Pattern */}
                <div className="grid grid-cols-8 gap-1 h-full">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        Math.random() > 0.5 ? 'bg-background' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Scanning Effect */}
                {isScanning && (
                  <div className="absolute inset-0 border-4 border-primary rounded-2xl">
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-bounce" style={{ top: `${scanProgress}%` }} />
                  </div>
                )}
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg" />
            </div>

            {/* Progress */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scanning...</span>
                  <span className="text-primary font-medium">{scanProgress}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Scan Button */}
            {!isScanning ? (
              <Button 
                variant="neon" 
                size="lg" 
                className="w-full"
                onClick={handleScanQR}
              >
                <Scan className="w-5 h-5 mr-2" />
                Scan QR Code
              </Button>
            ) : (
              <div className="text-center space-y-2">
                <Scan className="w-8 h-8 text-primary mx-auto pulse-glow" />
                <p className="text-sm text-primary font-medium">Processing scan...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="glass-card p-4 space-y-3 slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-semibold flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" />
            How it works
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mt-0.5">1</div>
              <p>Scan the QR code at the parking entrance</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mt-0.5">2</div>
              <p>View real-time parking availability</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mt-0.5">3</div>
              <p>Get AR navigation to your assigned slot</p>
            </div>
          </div>
        </div>

        {/* Demo Link */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary-glow"
            onClick={onEntry}
          >
            Skip to Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Smart Parking System Online</span>
          <Zap className="w-3 h-3 text-primary" />
        </div>
      </div>
    </div>
  );
};