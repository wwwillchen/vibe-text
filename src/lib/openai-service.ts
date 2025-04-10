
import { Tone, Length } from '@/components/text-rewriter/types';

// Function to generate detailed system prompts based on tone and length
const generateSystemPrompt = (tone: Tone, length: Length): string => {
  let prompt = `You are an expert text rewriter. Your task is to rewrite the given text according to the specified tone and length, while preserving the core meaning and key information.`;

  // Tone descriptions
  switch (tone) {
    case 'Professional':
      prompt += `\n\n**Tone: Professional**\nAdopt a formal, objective, and polished tone suitable for business communication. Use precise language, avoid slang or overly casual expressions, and maintain a respectful and courteous demeanor. Ensure clarity, conciseness, and grammatical correctness. The language should be appropriate for official reports, emails to superiors or clients, or formal presentations. Avoid contractions and use standard business vocabulary.`;
      break;
    case 'Neutral':
      prompt += `\n\n**Tone: Neutral**\nAdopt a balanced, objective, and straightforward tone. Avoid strong emotional language, slang, or overly formal/informal expressions. Focus on clear and direct communication of information. The language should be generally acceptable in most contexts, neither overly stiff nor overly familiar. Stick to factual statements and standard vocabulary.`;
      break;
    case 'Casual':
      prompt += `\n\n**Tone: Casual**\nAdopt a relaxed, friendly, and informal tone. Feel free to use common contractions (like "don't", "it's"), colloquialisms (appropriately), and a more personal, conversational style. The language should sound natural and approachable, like speaking to a colleague or friend. Inject some personality but avoid being unprofessional or unclear. **Make it fun and engaging by adding relevant emojis where appropriate! 🎉👍**`; // Added emoji instruction
      break;
  }

  // Length descriptions
  switch (length) {
    case 'Shorter':
      prompt += `\n\n**Length: Shorter**\nSignificantly condense the text while retaining the essential message. Focus on brevity and conciseness. Remove redundant words, phrases, or sentences. Summarize key points where appropriate. Aim for a noticeably shorter output than the original.`;
      break;
    case 'Same':
      prompt += `\n\n**Length: Same**\nMaintain a similar length to the original text. Rewrite the content to match the specified tone, but avoid significantly adding or removing information. Focus on rephrasing and adjusting the style rather than changing the overall volume of text.`;
      break;
    case 'Longer':
      prompt += `\n\n**Length: Longer**\nExpand on the original text by adding relevant details, explanations, or examples, while staying consistent with the core message. Elaborate on key points to provide more context or clarity. Ensure the added content enhances the original message and fits the specified tone. Aim for a noticeably longer output than the original.`;
      break;
  }
  
  prompt += `\n\nRewrite the following text based on these instructions:\n---`;
  
  return prompt;
};


export async function* streamTextRewrite(
  text: string,
  tone: Tone,
  length: Length,
  apiKey: string
): AsyncGenerator<string, void, undefined> {
  if (!apiKey) {
    throw new Error("API key is required.");
  }

  const systemPrompt = generateSystemPrompt(tone, length);
  let accumulatedContent = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Or your preferred model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(
        `API request failed with status ${response.status}: ${errorData.error?.message || response.statusText}`
      );
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      
      // Process Server-Sent Events (SSE)
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.substring(6).trim();
          if (data === "[DONE]") {
            // End of stream
          } else {
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulatedContent += delta;
                yield accumulatedContent; // Yield the updated full content
              }
            } catch (e) {
              console.error("Error parsing stream data:", e, "Data:", data);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error during streaming:", error);
    if (error instanceof Error) {
      throw new Error(`Streaming failed: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during streaming.");
    }
  }
}

