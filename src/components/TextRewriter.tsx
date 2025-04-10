
"use client";

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ToneLengthSelector from './ToneLengthSelector';
import { Loader2, Sparkles, BookOpen, KeyRound, Info } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { streamTextRewrite } from "@/lib/openai-service";

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

const TextRewriter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [selectedTone, setSelectedTone] = useState<Tone>('Neutral');
  const [selectedLength, setSelectedLength] = useState<Length>('Same');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('original');
  
  // Check for API key in localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyDialog(true);
    }
  }, []);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.warning("Please enter some text to rewrite.");
      return;
    }
    
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key.");
      setShowApiKeyDialog(true);
      return;
    }
    
    setIsLoading(true);
    setIsStreaming(true);
    setDisplayText('');
    
    try {
      // Use the streaming API with the user-provided API key
      const streamGenerator = streamTextRewrite(inputText, selectedTone, selectedLength, apiKey);
      
      for await (const chunk of streamGenerator) {
        setDisplayText(chunk);
      }
      
      toast.success("Text rewritten successfully!");
      setActiveTab('rewritten'); // Switch to rewritten tab after completion
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast.error("Error: Could not rewrite text. Check your API key and try again.");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleToneLengthSelect = (tone: Tone, length: Length) => {
    setSelectedTone(tone);
    setSelectedLength(length);
  };

  const handleExampleSelect = (text: string) => {
    setInputText(text);
    setDisplayText('');
    setActiveTab('original');
  };

  const handleApiKeySave = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      localStorage.setItem('openai_api_key', tempApiKey);
      setShowApiKeyDialog(false);
      toast.success("API key saved!");
    } else {
      toast.error("Please enter a valid API key.");
    }
  };

  // Define a more subtle text shadow style
  const textShadowStyle = { textShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)' };

  // Placeholder text
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
          
          {/* API Key Dialog */}
          <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setTempApiKey(apiKey);
                  setShowApiKeyDialog(true);
                }}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {apiKey ? "Change API Key" : "Set API Key"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>OpenAI API Key</DialogTitle>
                <DialogDescription>
                  Enter your OpenAI API key to use the text rewriting service. Your key is stored locally in your browser and never sent to our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 py-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="api-key" className="sr-only">
                    API Key
                  </Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="h-3 w-3 mr-1" />
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Get an API key
                  </a>
                </div>
                <Button type="submit" onClick={handleApiKeySave}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="rewritten">Rewritten</TabsTrigger>
              </TabsList>
              <TabsContent value="original">
                <Textarea
                  placeholder={placeholderText}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading || isStreaming}
                  rows={12}
                  className="resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-h-[240px] md:min-h-[320px]"
                />
              </TabsContent>
              <TabsContent value="rewritten">
                <Textarea
                  placeholder="Rewritten text will appear here..."
                  value={displayText}
                  readOnly
                  rows={12}
                  className={cn(
                    "resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-h-[240px] md:min-h-[320px]",
                    isStreaming && "animate-pulse"
                  )}
                />
                {isStreaming && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    <span>Streaming response...</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
               disabled={isLoading || isStreaming || !inputText.trim() || !apiKey}
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
