
"use client";

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Import CardHeader and CardTitle, CardDescription
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  // Simple mock response based on tone/length
  let prefix = `(Rewritten - Tone: ${tone}, Length: ${length})\n\n`;
  let modifiedText = text;

  if (length === 'Shorter') {
    modifiedText = text.split('.').slice(0, Math.max(1, Math.floor(text.split('.').length / 2))).join('.') + (text.includes('.') ? '.' : '');
  } else if (length === 'Longer') {
    modifiedText = text + "\n\nAdditionally, we should consider the implications for future projects and ensure alignment across teams.";
  }

  if (tone === 'Casual') {
    modifiedText = modifiedText.replace(/Regards/gi, 'Cheers').replace(/Sincerely/gi, 'Best').replace(/following up/gi, 'just checking in');
    prefix = `(Casual rewrite - ${length})\n\nYo! `;
  } else if (tone === 'Professional') {
     modifiedText = modifiedText.replace(/Hey/gi, 'Dear Sir/Madam').replace(/Cheers/gi, 'Sincerely').replace(/just checking in/gi, 'following up');
     prefix = `(Professional rewrite - ${length})\n\nEsteemed Colleague,\n\n`;
  }


  return prefix + modifiedText;
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

  // Define a more subtle text shadow style
  const textShadowStyle = { textShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)' };

  // Updated placeholder text
  const placeholderText = `Example:\n\nSubject: Quick Question\n\nHey team,\n\nJust wanted to check in on the status of the Q3 report. Is it still on track for the EOD deadline?\n\nLet me know if there's anything I can do to help.\n\nThanks,\nAlex`;

  return (
    // Removed the outer header div
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Added shadow-md class here */}
      <Card className="shadow-md">
        {/* Moved Header inside Card using CardHeader */}
        <CardHeader className="text-center pb-4"> {/* Added padding-bottom */}
          <CardTitle
            className="text-2xl font-semibold tracking-tight"
            style={textShadowStyle} // Apply text shadow
          >
            AI Text Rewriter
          </CardTitle>
          <CardDescription
            className="text-sm text-muted-foreground"
            style={textShadowStyle} // Apply text shadow
          >
            Rewrite your text with the desired tone and length
          </CardDescription>
        </CardHeader>

        {/* Content remains vertically centered */}
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 flex flex-col md:flex-row gap-6 md:gap-8 items-center"> {/* Removed top padding */}
          {/* Textarea Section */}
          <div className="space-y-2 w-full md:flex-1">
            <Label htmlFor="input-text" className="sr-only">Your Text</Label>
            <Textarea
              id="input-text"
              placeholder={placeholderText} // Use the new placeholder variable
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-h-[240px] md:min-h-[320px]"
            />
          </div>

          {/* ToneLengthSelector & Button Section */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-stretch gap-4">
             <ToneLengthSelector
               selectedTone={selectedTone}
               selectedLength={selectedLength}
               onSelect={handleToneLengthSelect}
             />
             <Button
               onClick={handleRewrite}
               disabled={isLoading || !inputText.trim()}
               className={cn(
                 "w-full h-11 px-8 text-base",
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TextRewriter;
