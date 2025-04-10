
import OpenAI from 'openai';

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

// Initialize OpenAI with the user-provided API key
function getOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Only for demo purposes, in production use a backend
  });
}

export async function rewriteTextWithOpenAI(
  text: string, 
  tone: Tone, 
  length: Length,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  try {
    const openai = getOpenAIClient(apiKey);
    
    // Create a prompt based on the selected tone and length
    const prompt = createPrompt(text, tone, length);
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt.systemPrompt
        },
        {
          role: "user",
          content: prompt.userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: calculateMaxTokens(text, length),
      stream: false
    });

    // Return the rewritten text
    return response.choices[0]?.message?.content || "Sorry, I couldn't rewrite the text.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to rewrite text with OpenAI");
  }
}

// Helper function to create appropriate prompts based on tone and length
function createPrompt(text: string, tone: Tone, length: Length) {
  let systemPrompt = "You are an expert writing assistant that rewrites text to match specific tones and lengths while maintaining the original meaning.";
  
  // Add tone-specific instructions
  switch (tone) {
    case 'Casual':
      systemPrompt += " Use a casual, conversational tone with relaxed language, contractions, and a friendly approach.";
      break;
    case 'Neutral':
      systemPrompt += " Use a balanced, neutral tone that's neither too formal nor too casual.";
      break;
    case 'Professional':
      systemPrompt += " Use a formal, professional tone with precise language, proper grammar, and a business-appropriate style.";
      break;
  }
  
  // Add length-specific instructions
  switch (length) {
    case 'Shorter':
      systemPrompt += " Make the text more concise while preserving the key information.";
      break;
    case 'Same':
      systemPrompt += " Keep approximately the same length as the original text.";
      break;
    case 'Longer':
      systemPrompt += " Expand on the original text with additional relevant details or explanations.";
      break;
  }
  
  // Create the user prompt
  const userPrompt = `Please rewrite the following text:\n\n${text}`;
  
  return { systemPrompt, userPrompt };
}

// Helper function to calculate appropriate max tokens based on input length
function calculateMaxTokens(text: string, length: Length): number {
  // Rough estimate: 1 token ≈ 4 characters in English
  const estimatedInputTokens = Math.ceil(text.length / 4);
  
  // Adjust based on desired output length
  switch (length) {
    case 'Shorter':
      return Math.max(50, Math.floor(estimatedInputTokens * 0.7));
    case 'Same':
      return Math.max(100, Math.floor(estimatedInputTokens * 1.2));
    case 'Longer':
      return Math.max(150, Math.floor(estimatedInputTokens * 2));
  }
}

// Function to stream responses from OpenAI
export async function* streamTextRewrite(
  text: string,
  tone: Tone,
  length: Length,
  apiKey: string
): AsyncGenerator<string> {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  try {
    const openai = getOpenAIClient(apiKey);
    
    // Create a prompt based on the selected tone and length
    const prompt = createPrompt(text, tone, length);
    
    // Call the OpenAI API with streaming enabled
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt.systemPrompt
        },
        {
          role: "user",
          content: prompt.userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: calculateMaxTokens(text, length),
      stream: true
    });
    
    // Yield each chunk of the response as it arrives
    let accumulatedText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      accumulatedText += content;
      yield accumulatedText;
    }
  } catch (error) {
    console.error("Error streaming from OpenAI API:", error);
    throw new Error("Failed to stream text rewrite from OpenAI");
  }
}
