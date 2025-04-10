
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

interface ToneLengthSelectorProps {
  selectedTone: Tone; // Used for initial position
  selectedLength: Length; // Used for initial position
  onSelect: (tone: Tone, length: Length) => void;
}

// Map discrete values to percentage ranges for initial position setting
// Y-axis: Professional (top) = low %, Casual (bottom) = high %
// X-axis: Shorter (left) = low %, Longer (right) = high %
const toneToY: Record<Tone, number> = { 'Professional': 16.5, 'Neutral': 50, 'Casual': 83.5 };
const lengthToX: Record<Length, number> = { 'Shorter': 16.5, 'Same': 50, 'Longer': 83.5 };

const ToneLengthSelector: React.FC<ToneLengthSelectorProps> = ({ selectedTone, selectedLength, onSelect }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  // Position state [x%, y%]
  const [position, setPosition] = useState<[number, number]>([lengthToX[selectedLength], toneToY[selectedTone]]);
  const [isDragging, setIsDragging] = useState(false);

  const mapPositionToValues = (xPercent: number, yPercent: number): { tone: Tone; length: Length } => {
    let tone: Tone;
    // Y-axis mapping (inverted: lower y% means more professional)
    if (yPercent < 33.3) tone = 'Professional';
    else if (yPercent < 66.6) tone = 'Neutral';
    else tone = 'Casual';

    let length: Length;
    // X-axis mapping
    if (xPercent < 33.3) length = 'Shorter';
    else if (xPercent < 66.6) length = 'Same';
    else length = 'Longer';

    return { tone, length };
  };

  const handleInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();
    let clientX, clientY;

    // Check if it's a touch event
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) { // Check if it's a mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
        return; // Ignore if neither touch nor mouse event
    }


    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Clamp position within bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setPosition([xPercent, yPercent]);
    const { tone, length } = mapPositionToValues(xPercent, yPercent);
    onSelect(tone, length); // Notify parent with mapped discrete values
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleInteraction(event);
    // Prevent text selection during drag
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleInteraction(event);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
        setIsDragging(false);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
     setIsDragging(true);
     handleInteraction(event);
     // Prevent scrolling while dragging inside the box
     event.preventDefault();
   };

   const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
     if (isDragging) {
       handleInteraction(event);
     }
   };

   const handleTouchEnd = () => {
     if (isDragging) {
        setIsDragging(false);
     }
   };

  // Add mouseup/touchend listener to window to catch drags ending outside the box
   useEffect(() => {
     const handleInteractionEndGlobal = () => {
       if (isDragging) {
         setIsDragging(false);
       }
     };

     window.addEventListener('mouseup', handleInteractionEndGlobal);
     window.addEventListener('touchend', handleInteractionEndGlobal);

     return () => {
       window.removeEventListener('mouseup', handleInteractionEndGlobal);
       window.removeEventListener('touchend', handleInteractionEndGlobal);
     };
   }, [isDragging]);


  // Labels
  const tones: Tone[] = ['Casual', 'Neutral', 'Professional']; // Y-axis (rows) - Casual at bottom
  const lengths: Length[] = ['Shorter', 'Same', 'Longer']; // X-axis (columns)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjust Tone & Length</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-4">
          {/* Y-axis Labels (Tone) */}
          <div className="flex flex-col justify-between items-end h-48 self-stretch py-1">
            {/* Reverse tones so Professional is at the top */}
            {tones.slice().reverse().map((tone) => (
              <Label key={tone} className="text-xs text-muted-foreground">{tone}</Label>
            ))}
          </div>

          {/* Interactive Box */}
          <div className="flex flex-col items-center">
            <div
              ref={boxRef}
              className="relative w-48 h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-md cursor-pointer overflow-hidden border border-muted touch-none" // Added touch-none
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              // onMouseUp handled by window listener
              onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves quickly
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              // onTouchEnd handled by window listener
            >
              {/* Selection Indicator */}
              <div
                className="absolute w-3 h-3 bg-primary rounded-full border-2 border-primary-foreground shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${position[0]}%`,
                  top: `${position[1]}%`,
                  transition: isDragging ? 'none' : 'left 0.1s ease-out, top 0.1s ease-out', // Smooth transition when not dragging
                }}
                aria-hidden="true"
              />
            </div>
            {/* X-axis Labels (Length) */}
            <div className="flex justify-between w-48 mt-2 px-1">
              {lengths.map((length) => (
                <Label key={length} className="text-xs text-muted-foreground">{length}</Label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToneLengthSelector;
