
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
// Removed Card imports
import { Label } from "@/components/ui/label";

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

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

  const handleInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else { return; }

    let x = clientX - rect.left;
    let y = clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setPosition([xPercent, yPercent]);
    const { tone, length } = mapPositionToValues(xPercent, yPercent);
    onSelect(tone, length);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleInteraction(event);
    event.preventDefault();
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => { if (isDragging) handleInteraction(event); };
  const handleMouseUp = () => { if (isDragging) setIsDragging(false); };
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => { setIsDragging(true); handleInteraction(event); event.preventDefault(); };
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => { if (isDragging) handleInteraction(event); };
  const handleTouchEnd = () => { if (isDragging) setIsDragging(false); };

  useEffect(() => {
    const handleInteractionEndGlobal = () => { if (isDragging) setIsDragging(false); };
    window.addEventListener('mouseup', handleInteractionEndGlobal);
    window.addEventListener('touchend', handleInteractionEndGlobal);
    return () => {
      window.removeEventListener('mouseup', handleInteractionEndGlobal);
      window.removeEventListener('touchend', handleInteractionEndGlobal);
    };
  }, [isDragging]);

  const tones: Tone[] = ['Casual', 'Neutral', 'Professional'];
  const lengths: Length[] = ['Shorter', 'Same', 'Longer'];

  return (
    // Removed Card wrapper, using a simple div with padding
    <div className="p-4 rounded-md bg-muted/40"> {/* Added background to group elements */}
      {/* Removed CardHeader */}
      <h3 className="text-lg font-medium mb-4 text-center">Adjust Tone & Length</h3> {/* Replaced CardTitle */}

      {/* Removed CardContent */}
      <div className="flex items-center justify-center space-x-4">
        {/* Y-axis Labels (Tone) */}
        <div className="flex flex-col justify-between items-end h-48 self-stretch py-1">
          {tones.slice().reverse().map((tone) => (
            <Label key={tone} className="text-xs text-muted-foreground">{tone}</Label>
          ))}
        </div>

        {/* Interactive Box */}
        <div className="flex flex-col items-center">
          <div
            ref={boxRef}
            // Removed border, adjusted background
            className="relative w-48 h-48 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50 rounded-md cursor-pointer overflow-hidden touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Selection Indicator */}
            <div
              className="absolute w-3 h-3 bg-primary rounded-full border-2 border-primary-foreground shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${position[0]}%`,
                top: `${position[1]}%`,
                transition: isDragging ? 'none' : 'left 0.1s ease-out, top 0.1s ease-out',
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
    </div>
  );
};

export default ToneLengthSelector;
