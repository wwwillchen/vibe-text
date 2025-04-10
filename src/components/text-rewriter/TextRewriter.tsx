
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { streamTextRewrite } from "@/lib/openai-service";
import { Tone, Length, TextRewriterState } from './types';
import { cannedExamples, placeholderText, toneDescriptions, lengthDescriptions } from './constants';
import { ApiKeyDialog } from './ApiKeyDialog';
import { ExampleDropdown } from './ExampleDropdown';
import { TextTabs } from './TextTabs';
import { RewriteButton } from './RewriteButton';
import ToneLengthSelector from './ToneLengthSelector';

const TextRewriter: React.FC = () => {
  const [state, setState] = useState<TextRewriterState>({
    inputText: '',
    displayText: '',
    isStreaming: false,
    selectedTone: 'Neutral',
    selectedLength: 'Same',
    isLoading: false,
    apiKey: '',
    showApiKeyDialog: false,
    tempApiKey: '',
    activeTab: 'original'
  });

  // Check for API key in localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setState(prev => ({ ...prev, apiKey: savedApiKey }));
    } else {
      setState(prev => ({ ...prev, showApiKeyDialog: true }));
    }
  }, []);

  const handleRewrite = async () => {
    if (!state.inputText.trim()) {
      toast.warning("Please enter some text to rewrite.");
      return;
    }
    
    if (!state.apiKey) {
      toast.error("Please enter your OpenAI API key.");
      setState(prev => ({ ...prev, showApiKeyDialog: true }));
      return;
    }
    
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      isStreaming: true, 
      displayText: '',
      activeTab: 'rewritten' // Switch to rewritten tab immediately
    }));
    
    try {
      const streamGenerator = streamTextRewrite(
        state.inputText, 
        state.selectedTone, 
        state.selectedLength, 
        state.apiKey
      );
      
      for await (const chunk of streamGenerator) {
        setState(prev => ({ ...prev, displayText: chunk }));
      }
      
      // Get the tone and length descriptions for the toast
      const toneDesc = toneDescriptions.find(t => t.tone === state.selectedTone);
      const lengthDesc = lengthDescriptions.find(l => l.length === state.selectedLength);
      
      toast.success(
        `Text TRANSFORMED to ${toneDesc?.emoji} ${state.selectedTone} tone and ${lengthDesc?.emoji} ${state.selectedLength} length!`,
        { duration: 4000 }
      );
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast.error("ERROR! Could not rewrite text. Check your API key and try again.", { 
        duration: 5000,
        style: { backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 'bold' }
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false, isStreaming: false }));
    }
  };

  const handleToneLengthSelect = (tone: Tone, length: Length) => {
    setState(prev => ({ ...prev, selectedTone: tone, selectedLength: length }));
    
    // Show a toast when the user changes the tone/length
    const toneDesc = toneDescriptions.find(t => t.tone === tone);
    const lengthDesc = lengthDescriptions.find(l => l.length === length);
    
    toast(`${toneDesc?.emoji} ${tone} + ${lengthDesc?.emoji} ${length} selected!`, {
      duration: 1500,
      position: 'bottom-center'
    });
  };

  const handleExampleSelect = (text: string) => {
    setState(prev => ({ ...prev, inputText: text, displayText: '', activeTab: 'original' }));
  };

  const handleApiKeySave = () => {
    if (state.tempApiKey.trim()) {
      localStorage.setItem('openai_api_key', state.tempApiKey);
      setState(prev => ({
        ...prev,
        apiKey: state.tempApiKey,
        showApiKeyDialog: false
      }));
      toast.success("API key saved! You're ready to TRANSFORM text!", {
        duration: 3000,
        style: { fontWeight: 'bold' }
      });
    } else {
      toast.error("Please enter a valid API key.");
    }
  };

  const textShadowStyle = { textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="shadow-xl border-2 border-gray-200">
        <CardHeader className="text-center pb-4">
          <CardTitle
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
            style={textShadowStyle}
          >
            ✨ EXTREME Text Transformer ✨
          </CardTitle>
          <CardDescription
            className="text-sm text-muted-foreground"
            style={textShadowStyle}
          >
            Transform your boring text into AMAZING content with any tone and length!
          </CardDescription>
          
          <ApiKeyDialog
            open={state.showApiKeyDialog}
            onOpenChange={(open) => setState(prev => ({ ...prev, showApiKeyDialog: open }))}
            apiKey={state.apiKey}
            tempApiKey={state.tempApiKey}
            setTempApiKey={(key) => setState(prev => ({ ...prev, tempApiKey: key }))}
            onSave={handleApiKeySave}
          />
        </CardHeader>

        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Text Input Section - 50% width */}
          <div className="space-y-2 w-full md:w-1/2">
            <ExampleDropdown 
              onSelect={handleExampleSelect}
              examples={cannedExamples}
            />

            <TextTabs
              activeTab={state.activeTab}
              onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
              inputText={state.inputText}
              onInputChange={(text) => setState(prev => ({ ...prev, inputText: text }))}
              displayText={state.displayText}
              isLoading={state.isLoading}
              isStreaming={state.isStreaming}
              placeholder={placeholderText}
            />
          </div>

          {/* Visualization Section - 50% width */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-4">
            <ToneLengthSelector
              selectedTone={state.selectedTone}
              selectedLength={state.selectedLength}
              onSelect={handleToneLengthSelect}
            />
            <RewriteButton
              onClick={handleRewrite}
              disabled={state.isLoading || state.isStreaming || !state.inputText.trim() || !state.apiKey}
              isLoading={state.isLoading}
              selectedTone={state.selectedTone}
              selectedLength={state.selectedLength}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextRewriter;
