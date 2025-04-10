
import OpenAI from 'openai';
import type { Tone, Length } from '@/components/text-rewriter/types';

/**
 * Streams text rewrite from OpenAI API
 * @param text The original text to rewrite
 * @param tone The desired tone (Casual, Neutral, Professional)
 * @param length The desired length (Shorter, Same, Longer)
 * @param apiKey The user's OpenAI API key
 */
export async function* streamTextRewrite(
  text: string,
  tone: Tone,
  length: Length,
  apiKey: string
): AsyncGenerator<string> {
  if (!text || !apiKey) {
    throw new Error('Text and API key are required');
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });

    // Construct the prompt based on tone and length
    const prompt = constructPrompt(text, tone, length);
    
    // Call the OpenAI API with streaming enabled
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: calculateMaxTokens(text, length),
    });

    let accumulatedText = '';
    
    // Process the stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        accumulatedText += content;
        yield accumulatedText;
      }
    }
  } catch (error) {
    console.error('Error in OpenAI streaming:', error);
    throw error;
  }
}

/**
 * Constructs the prompt for the OpenAI API based on the desired tone and length
 */
function constructPrompt(text: string, tone: Tone, length: Length): string {
  let prompt = `Rewrite the following text in a ${tone.toLowerCase()} tone`;
  
  if (length === 'Shorter') {
    prompt += ' and make it more concise';
  } else if (length === 'Longer') {
    prompt += ' and expand it with more details';
  } else {
    prompt += ' while maintaining approximately the same length';
  }
  
  prompt += `. Preserve the original meaning and key information.\n\nOriginal text:\n${text}\n\nRewritten text:`;
  
  return prompt;
}

/**
 * Calculates the maximum tokens to allow based on the original text length and desired output length
 */
function calculateMaxTokens(text: string, length: Length): number {
  // Rough estimate: 1 token ≈ 4 characters in English
  const estimatedTokens = Math.ceil(text.length / 4);
  
  // Adjust based on desired length
  const multiplier = length === 'Shorter' ? 0.7 : length === 'Longer' ? 1.5 : 1.0;
  
  // Set a reasonable minimum and maximum
  const calculatedTokens = Math.ceil(estimatedTokens * multiplier);
  return Math.max(Math.min(calculatedTokens, 2000), 100);
}
