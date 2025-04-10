
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Tone, Length } from './types';
import { toneDescriptions, lengthDescriptions } from './constants';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToneLengthSelectorProps {
  selectedTone: Tone;
  selectedLength: Length;
  onSelect: (tone: Tone, length: Length) => void;
}

const toneToY: Record<Tone, number> = { 'Professional': 16.5, 'Neutral': 50, 'Casual': 83.5 };
const lengthToX: Record<Length, number> = { 'Shorter': 16.5, 'Same': 50, 'Longer': 83.5 };

const ToneLengthSelector: React.FC<ToneLengthSelectorProps> = ({ selectedTone, selectedLength, onSelect }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<[number, number]>([lengthToX[selectedLength], toneToY[selectedTone]]);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Update position if props change externally
  useEffect(() => {
    setPosition([lengthToX[selectedLength], toneToY[selectedTone]]);
  }, [selectedTone, selectedLength]);

  const mapPositionToValues = (xPercent: number, yPercent: number): { tone: Tone; length: Length } => {
    let tone: Tone;
    if (yPercent < 33.3) tone = 'Professional';
    else if (yPercent < 66.6) tone = 'Neutral';
    else tone = 'Casual';

    let length: Length;
    if (xPercent < 33.3) length = 'Shorter';
    else if (xPercent < 66.6) length = 'Same';
    else length = 'Longer';

    return { tone, length };
  };

  // Use useCallback to memoize the event handler functions
  const handleInteraction = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else { 
      return; 
    }

    let x = clientX - rect.left;
    let y = clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setPosition([xPercent, yPercent]);
    const { tone, length } = mapPositionToValues(xPercent, yPercent);
    onSelect(tone, length);
  }, [onSelect]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setShowTooltip(true);
    handleInteraction(event);
    event.preventDefault(); 
  }, [handleInteraction]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement> | MouseEvent) => { 
    if (isDragging) handleInteraction(event as any); 
  }, [isDragging, handleInteraction]);

  const handleMouseUp = useCallback(() => { 
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setShowTooltip(false), 1500);
    }
  }, [isDragging]);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => { 
    setIsDragging(true);
    setShowTooltip(true);
    handleInteraction(event); 
    event.preventDefault(); 
  }, [handleInteraction]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement> | TouchEvent) => { 
    if (isDragging) handleInteraction(event as any); 
  }, [isDragging, handleInteraction]);

  const handleTouchEnd = useCallback(() => { 
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setShowTooltip(false), 1500);
    }
  }, [isDragging]);

  // Add global listeners
  useEffect(() => {
    const handleInteractionEndGlobal = (event: MouseEvent | TouchEvent) => {
      if (isDragging) {
        if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
          setIsDragging(false);
          setTimeout(() => setShowTooltip(false), 1500);
        } else if (event.type === 'mouseup' || event.type === 'touchend') {
          setIsDragging(false);
          setTimeout(() => setShowTooltip(false), 1500);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('touchmove', handleTouchMove as any);
      window.addEventListener('mouseup', handleInteractionEndGlobal);
      window.addEventListener('touchend', handleInteractionEndGlobal);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('mouseup', handleInteractionEndGlobal);
      window.removeEventListener('touchend', handleInteractionEndGlobal);
    };
  }, [isDragging, handleMouseMove, handleTouchMove]);

  // Find the current tone and length descriptions
  const currentToneDesc = toneDescriptions.find(t => t.tone === selectedTone);
  const currentLengthDesc = lengthDescriptions.find(l => l.length === selectedLength);

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Current Selection Display */}
      <div className="flex flex-col items-center space-y-2 w-full">
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="text-lg px-3 py-1 font-semibold">
            {currentToneDesc?.emoji} {selectedTone}
          </Badge>
          <span className="text-muted-foreground">+</span>
          <Badge variant="outline" className="text-lg px-3 py-1 font-semibold">
            {currentLengthDesc?.emoji} {selectedLength}
          </Badge>
        </div>
        <p className="text-xs text-center text-muted-foreground max-w-xs">
          {currentToneDesc?.description} + {currentLengthDesc?.description}
        </p>
      </div>

      {/* Interactive Box */}
      <div
        ref={boxRef}
        className={cn(
          "relative w-full h-64 rounded-md cursor-pointer overflow-hidden touch-none",
          "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100",
          "border border-muted shadow-inner"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => isDragging && handleMouseMove(e)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => isDragging && handleTouchMove(e)}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <div className="border-r border-b border-gray-200/50"></div>
          <div className="border-r border-l border-b border-gray-200/50"></div>
          <div className="border-l border-b border-gray-200/50"></div>
          <div className="border-r border-t border-b border-gray-200/50"></div>
          <div className="border-r border-l border-t border-b border-gray-200/50"></div>
          <div className="border-l border-t border-b border-gray-200/50"></div>
          <div className="border-r border-t border-gray-200/50"></div>
          <div className="border-r border-l border-t border-gray-200/50"></div>
          <div className="border-l border-t border-gray-200/50"></div>
        </div>
        
        {/* Tone Labels (Y-axis) */}
        <div className="absolute left-2 top-2 flex items-center">
          <span className="text-xs font-bold text-blue-700">🧐 ULTRA-FORMAL</span>
        </div>
        <div className="absolute left-2 bottom-2 flex items-center">
          <span className="text-xs font-bold text-pink-700">😎 SUPER CASUAL</span>
        </div>
        
        {/* Length Labels (X-axis) */}
        <div className="absolute bottom-2 left-1/4 transform -translate-x-1/2 text-xs font-bold text-purple-700">
          🔍 TINY
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-bold text-purple-700">
          📚 MASSIVE
        </div>

        {/* Selection Indicator with Tooltip */}
        <TooltipProvider>
          <Tooltip open={showTooltip || isDragging}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "absolute w-5 h-5 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none",
                  isDragging && "scale-125 transition-transform"
                )}
                style={{
                  left: `${position[0]}%`,
                  top: `${position[1]}%`,
                  transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="font-semibold">
              {currentToneDesc?.emoji} {selectedTone} + {currentLengthDesc?.emoji} {selectedLength}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Quadrant Labels */}
        <div className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-[10px] text-muted-foreground opacity-70">
          Professional & Shorter
        </div>
        <div className="absolute right-1/4 top-1/4 transform translate-x-1/2 -translate-y-1/2 text-[10px] text-muted-foreground opacity-70">
          Professional & Longer
        </div>
        <div className="absolute left-1/4 bottom-1/4 transform -translate-x-1/2 translate-y-1/2 text-[10px] text-muted-foreground opacity-70">
          Casual & Shorter
        </div>
        <div className="absolute right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2 text-[10px] text-muted-foreground opacity-70">
          Casual & Longer
        </div>
      </div>
    </div>
  );
};

export default ToneLengthSelector;
