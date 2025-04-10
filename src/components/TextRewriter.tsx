
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Removed Card imports
import ToneLengthSelector from './ToneLengthSelector';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

const rewriteText = async (text: string, tone: Tone, length: Length): Promise<string> => {
  console.log(`Rewriting text with Tone: ${tone}, Length: ${length}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `(Rewritten - Tone: ${tone}, Length: ${length})\n\n${text}`;
};

const TextRewriter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<Tone>('Neutral');
  const [selectedLength, setSelectedLength] = useState<Length>('Same');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.warning("Please enter some text to rewrite.");
      console.warn("Input text is empty.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await rewriteText(inputText, selectedTone, selectedLength);
      setInputText(result);
      toast.success("Text rewritten successfully!");
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast.error("Error: Could not rewrite text.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToneLengthSelect = (tone: Tone, length: Length) => {
    setSelectedTone(tone);
    setSelectedLength(length);
    console.log(`Selected Tone: ${tone}, Length: ${length}`);
  };

  return (
    // Removed the outer Card component, using a simple div with padding
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Removed CardHeader */}
      <div className="text-center"> {/* Added text-center for title/description */}
        <h1 className="text-2xl font-semibold tracking-tight mb-1">AI Text Rewriter</h1>
        <p className="text-sm text-muted-foreground">
          Paste your text, adjust tone/length, and click Rewrite. The text will be updated in place.
        </p>
      </div>

      {/* Removed CardContent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"> {/* Added items-start */}
        {/* Input Area */}
        <div className="space-y-2">
          <Label htmlFor="input-text" className="sr-only">Your Text</Label> {/* Hide label visually but keep for accessibility */}
          <Textarea
            id="input-text"
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12} // Slightly increased rows
            // Removed border and shadow for minimalism
            className="resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4 bg-muted/40 rounded-md"
          />
        </div>

        {/* Tone & Length Selector */}
        <ToneLengthSelector
          selectedTone={selectedTone}
          selectedLength={selectedLength}
          onSelect={handleToneLengthSelect}
        />
      </div>

      {/* Removed CardFooter */}
      <div className="flex flex-col items-center gap-4 pt-4"> {/* Added padding-top */}
         <Button onClick={handleRewrite} disabled={isLoading || !inputText.trim()} className="w-full md:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Rewriting...' : 'Rewrite Text'}
        </Button>
      </div>
    </div>
  );
};

export default TextRewriter;
