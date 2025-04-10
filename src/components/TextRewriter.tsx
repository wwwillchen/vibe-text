
"use client";

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Import DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToneLengthSelector from './ToneLengthSelector';
import { Loader2, Sparkles, BookOpen } from 'lucide-react'; // Added BookOpen icon
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

// Define canned examples
const cannedExamples = [
  {
    label: "Follow-up Email",
    text: `Subject: Following Up: Project Alpha\n\nHi Team,\n\nJust wanted to gently follow up on the action items from our meeting last Tuesday regarding Project Alpha. Could you please provide an update on your progress by end of day tomorrow?\n\nLet me know if you're facing any blockers.\n\nBest regards,\nSarah`
  },
  {
    label: "Meeting Request",
    text: `Subject: Meeting Request: Q4 Planning\n\nHello David,\n\nCould we schedule a brief 30-minute meeting sometime next week to discuss the initial planning for Q4 initiatives? Please let me know what time works best for you.\n\nThanks,\nMichael`
  },
  {
    label: "Short Announcement",
    text: `Quick update: The new coffee machine has arrived and is now operational in the break room. Enjoy!`
  },
  {
    label: "Thank You Note",
    text: `Hi Jennifer,\n\nThank you so much for your help with the presentation yesterday. Your insights were invaluable, and it really made a difference!\n\nBest,\nChris`
  }
];

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

  const handleExampleSelect = (text: string) => {
    setInputText(text);
    // Removed toast notification when loading an example
  };

  // Define a more subtle text shadow style
  const textShadowStyle = { textShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)' };

  // Placeholder text (can be kept or removed)
  const placeholderText = `Paste your text here, or load an example...`;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="shadow-md">
        <CardHeader className="text-center pb-4">
          <CardTitle
            className="text-2xl font-semibold tracking-tight"
            style={textShadowStyle}
          >
            AI Text Rewriter
          </CardTitle>
          <CardDescription
            className="text-sm text-muted-foreground"
            style={textShadowStyle}
          >
            Rewrite your text with the desired tone and length
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          {/* Textarea Section */}
          <div className="space-y-2 w-full md:flex-1">
            {/* Dropdown Menu for Examples */}
            <div className="flex justify-start mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Load Example
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Select an Example</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {cannedExamples.map((example, index) => (
                    <DropdownMenuItem
                      key={index}
                      onSelect={() => handleExampleSelect(example.text)}
                      className="cursor-pointer"
                    >
                      {example.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Label htmlFor="input-text" className="sr-only">Your Text</Label>
            <Textarea
              id="input-text"
              placeholder={placeholderText}
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
