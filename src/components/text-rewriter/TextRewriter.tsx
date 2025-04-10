
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { streamTextRewrite } from "@/lib/openai-service";
import { Tone, Length, TextRewriterState } from './types';
import { cannedExamples, placeholderText } from './constants';
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
      
      toast.success("Text rewritten successfully!");
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast.error("Error: Could not rewrite text. Check your API key and try again.");
    } finally {
      setState(prev => ({ ...prev, isLoading: false, isStreaming: false }));
    }
  };

  const handleToneLengthSelect = (tone: Tone, length: Length) => {
    setState(prev => ({ ...prev, selectedTone: tone, selectedLength: length }));
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
      toast.success("API key saved!");
    } else {
      toast.error("Please enter a valid API key.");
    }
  };

  const textShadowStyle = { textShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)' };

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
          
          <ApiKeyDialog
            open={state.showApiKeyDialog}
            onOpenChange={(open) => setState(prev => ({ ...prev, showApiKeyDialog: open }))}
            apiKey={state.apiKey}
            tempApiKey={state.tempApiKey}
            setTempApiKey={(key) => setState(prev => ({ ...prev, tempApiKey: key }))}
            onSave={handleApiKeySave}
          />
        </CardHeader>

        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 flex flex-col md:flex-row gap-4 md:gap-6 items-center"> {/* Reduced gap from 6/8 to 4/6 */}
          <div className="space-y-2 w-full md:flex-1">
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

          <div className="w-full md:w-auto flex flex-col items-center md:items-stretch gap-4">
            <ToneLengthSelector
              selectedTone={state.selectedTone}
              selectedLength={state.selectedLength}
              onSelect={handleToneLengthSelect}
            />
            <RewriteButton
              onClick={handleRewrite}
              disabled={state.isLoading || state.isStreaming || !state.inputText.trim() || !state.apiKey}
              isLoading={state.isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextRewriter;
