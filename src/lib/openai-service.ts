
import OpenAI from 'openai';

// Initialize the OpenAI client
// Note: The API key should be set as an environment variable
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // This expects the API key to be set in .env.local
  dangerouslyAllowBrowser: true // Only for demo purposes, in production use a backend
});

type Tone = 'Casual' | 'Neutral' | 'Professional';
type Length = 'Shorter' | 'Same' | 'Longer';

export async function rewriteTextWithOpenAI(
  text: string, 
  tone: Tone, 
  length: Length
): Promise<string> {
  try {
    // Create a prompt based on the selected tone and length
    const prompt = createPrompt(text, tone, length);
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
  // Base system prompt
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
  
  // User prompt is simply the text to rewrite
  const userPrompt = `Please rewrite the following text:\n\n${text}`;
  
  return { systemPrompt, userPrompt };
}

// Helper function to calculate max tokens based on input length and desired output length
function calculateMaxTokens(text: string, length: Length): number {
  // Rough estimate: 1 token ≈ 4 characters in English
  const estimatedInputTokens = Math.ceil(text.length / 4);
  
  switch (length) {
    case 'Shorter':
      return Math.max(50, Math.floor(estimatedInputTokens * 0.7)); // 70% of original
    case 'Same':
      return Math.max(100, Math.floor(estimatedInputTokens * 1.2)); // 120% buffer
    case 'Longer':
      return Math.max(150, Math.floor(estimatedInputTokens * 2)); // 200% of original
    default:
      return 500; // Default fallback
  }
}

// Function to stream responses from OpenAI
export async function* streamTextRewrite(
  text: string,
  tone: Tone,
  length: Length
): AsyncGenerator<string> {
  try {
    // Create a prompt based on the selected tone and length
    const prompt = createPrompt(text, tone, length);
    
    // Call the OpenAI API with streaming enabled
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("Error streaming from OpenAI API:", error);
    throw new Error("Failed to stream text rewrite from OpenAI");
  }
}
