
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ToneLengthGrid from './ToneLengthGrid';
import { Loader2 } from 'lucide-react';

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
  const [outputText, setOutputText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<Tone>('Neutral');
  const [selectedLength, setSelectedLength] = useState<Length>('Same');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      // Maybe show a toast notification here?
      console.warn("Input text is empty.");
      return;
    }
    setIsLoading(true);
    setOutputText(''); // Clear previous output
    try {
      const result = await rewriteText(inputText, selectedTone, selectedLength);
      setOutputText(result);
    } catch (error) {
      console.error("Error rewriting text:", error);
      setOutputText("Error: Could not rewrite text.");
      // Show error toast
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
          <CardDescription>Paste your text below, select the desired tone and length, then click Rewrite.</CardDescription>
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
                disabled={isLoading}
              />
            </div>

            {/* Tone & Length Grid */}
            <ToneLengthGrid
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

           {/* Output Area */}
           {outputText && (
             <div className="w-full space-y-2 mt-4">
               <Label htmlFor="output-text">Rewritten Text</Label>
               <Textarea
                 id="output-text"
                 value={outputText}
                 readOnly
                 rows={10}
                 className="resize-none bg-muted/40"
                 placeholder="Rewritten text will appear here..."
               />
             </div>
           )}
        </CardFooter>
      </Card>


    </div>
  );
};

export default TextRewriter;

