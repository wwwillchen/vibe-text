
import { Example, ToneDescription, LengthDescription } from './types';

export const cannedExamples: Example[] = [
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

export const toneDescriptions: ToneDescription[] = [
  {
    tone: 'Professional',
    description: 'ULTRA-FORMAL and STRICTLY BUSINESS. Perfect for corporate communications, legal documents, and addressing CEOs.',
    emoji: '🧐'
  },
  {
    tone: 'Neutral',
    description: 'PERFECTLY BALANCED communication. Neither too formal nor too casual.',
    emoji: '😐'
  },
  {
    tone: 'Casual',
    description: 'SUPER RELAXED and FRIENDLY! Like chatting with your BFF! Uses slang and emojis liberally!',
    emoji: '😎'
  }
];

export const lengthDescriptions: LengthDescription[] = [
  {
    length: 'Shorter',
    description: 'EXTREMELY CONCISE! Cuts your text down to the absolute bare minimum!',
    emoji: '🔍'
  },
  {
    length: 'Same',
    description: 'Maintains approximately the same length as your original text.',
    emoji: '⚖️'
  },
  {
    length: 'Longer',
    description: 'DRAMATICALLY EXPANDED! Adds extensive details, examples, and elaboration!',
    emoji: '📚'
  }
];

export const placeholderText = `Paste your text here, or load an example...`;
