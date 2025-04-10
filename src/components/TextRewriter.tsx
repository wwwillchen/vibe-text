
"use client";

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card"; // Import Card components
import { Separator } from "@/components/ui/separator"; // Import Separator
import ToneLengthSelector from './ToneLengthSelector';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

const rewriteText = async (text: string, tone: Tone, length: Length): Promise<string> => {
  console.log(`Rewriting text with Tone: ${tone}, Length: ${length}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simple mock response
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
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">AI Text Rewriter</h1>
        <p className="text-sm text-muted-foreground">
          Rewrite your text with the desired tone and length
        </p>
      </div>

      {/* Wrap Textarea and ToneLengthSelector in a single Card */}
      <Card>
        <CardContent className="p-4 md:p-6 space-y-4"> {/* Add padding and space */}
          <div className="space-y-2">
            <Label htmlFor="input-text" className="sr-only">Your Text</Label>
            <Textarea
              id="input-text"
              placeholder="Paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10} // Adjusted rows slightly
              // Removed background and border, rely on Card styling
              className="resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            />
          </div>

          <Separator className="my-4" /> {/* Add Separator */}

          {/* ToneLengthSelector - remove its own padding/background */}
          <ToneLengthSelector
            selectedTone={selectedTone}
            selectedLength={selectedLength}
            onSelect={handleToneLengthSelect}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-4 pt-2"> {/* Reduced top padding */}
         <Button
           onClick={handleRewrite}
           disabled={isLoading || !inputText.trim()}
           className={cn(
             "w-full md:w-64 h-11 px-8 text-base",
             "bg-pink-500 text-white",
             "hover:bg-pink-600",
             "focus-visible:ring-pink-400",
             "disabled:opacity-70 disabled:cursor-not-allowed"
           )}
           size="lg"
         >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Rewriting...' : 'Rewrite Text'}
        </Button>
      </div>
    </div>
  );
};

export default TextRewriter;
