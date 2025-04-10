
export type Tone = 'Casual' | 'Neutral' | 'Professional';
export type Length = 'Shorter' | 'Same' | 'Longer';

export interface Example {
  label: string;
  text: string;
}

export interface ToneDescription {
  tone: Tone;
  description: string;
  emoji: string;
}

export interface LengthDescription {
  length: Length;
  description: string;
  emoji: string;
}

export interface TextRewriterState {
  inputText: string;
  displayText: string;
  isStreaming: boolean;
  selectedTone: Tone;
  selectedLength: Length;
  isLoading: boolean;
  apiKey: string;
  showApiKeyDialog: boolean;
  tempApiKey: string;
  activeTab: string;
}
