
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

interface ToneLengthGridProps {
  selectedTone: Tone;
  selectedLength: Length;
  onSelect: (tone: Tone, length: Length) => void;
}

const tones: Tone[] = ['Casual', 'Neutral', 'Professional']; // Y-axis (rows)
const lengths: Length[] = ['Shorter', 'Same', 'Longer']; // X-axis (columns)

const ToneLengthGrid: React.FC<ToneLengthGridProps> = ({ selectedTone, selectedLength, onSelect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjust Tone & Length</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-8">
          {/* Y-axis Labels (Tone) */}
          <div className="flex flex-col justify-between items-end h-40 mr-2">
            {tones.slice().reverse().map((tone) => (
              <Label key={tone} className="text-sm text-muted-foreground">{tone}</Label>
            ))}
          </div>

          {/* Grid */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-3 gap-2 w-48 h-40">
              {tones.slice().reverse().map((tone) => (
                lengths.map((length) => {
                  const isSelected = selectedTone === tone && selectedLength === length;
                  return (
                    <Button
                      key={`${tone}-${length}`}
                      variant={isSelected ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "w-full h-full rounded-md transition-all duration-150",
                        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => onSelect(tone, length)}
                      aria-label={`Tone: ${tone}, Length: ${length}`}
                    >
                      {/* Optional: Add icon or indicator */}
                    </Button>
                  );
                })
              ))}
            </div>
            {/* X-axis Labels (Length) */}
            <div className="flex justify-between w-48 mt-2">
              {lengths.map((length) => (
                <Label key={length} className="text-sm text-muted-foreground">{length}</Label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToneLengthGrid;
