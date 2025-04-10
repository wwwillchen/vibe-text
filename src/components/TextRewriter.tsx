
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ToneLengthSelector from './ToneLengthSelector';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"; // Import toast for notifications

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

// Placeholder for AI function
const rewriteText = async (text: string, tone: Tone, length: Length): Promise<string> => {
  console.log(`Rewriting text with Tone: ${tone}, Length: ${length}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Return dummy response
  return `(Rewritten - Tone: ${tone}, Length: ${length})\n\n${text}`;
};

const TextRewriter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  // Removed outputText state
  const [selectedTone, setSelectedTone] = useState<Tone>('Neutral');
  const [selectedLength, setSelectedLength] = useState<Length>('Same');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.warning("Please enter some text to rewrite."); // Use toast notification
      console.warn("Input text is empty.");
      return;
    }
    setIsLoading(true);
    // No need to clear outputText anymore
    try {
      const result = await rewriteText(inputText, selectedTone, selectedLength);
      setInputText(result); // Update the input text directly
      toast.success("Text rewritten successfully!"); // Success toast
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast.error("Error: Could not rewrite text."); // Error toast
      // Optionally, you might want to revert inputText or leave the error message somewhere
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
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Text Rewriter</CardTitle>
          <CardDescription>Paste your text, adjust tone/length, and click Rewrite. The text will be updated in place.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Area */}
            <div className="space-y-2">
              <Label htmlFor="input-text">Your Text</Label>
              <Textarea
                id="input-text"
                placeholder="Paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="resize-none"
                // Input is no longer disabled during loading, allowing selection, but editing might be weird.
                // Consider if disabling is preferred: disabled={isLoading}
              />
            </div>

            {/* Tone & Length Selector */}
            <ToneLengthSelector
              selectedTone={selectedTone}
              selectedLength={selectedLength}
              onSelect={handleToneLengthSelect}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
           <Button onClick={handleRewrite} disabled={isLoading || !inputText.trim()} className="w-full md:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Rewriting...' : 'Rewrite Text'}
          </Button>

           {/* Output Area Removed */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TextRewriter;
