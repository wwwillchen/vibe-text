
// This file is assumed to exist but wasn't provided in the codebase
// Adding a placeholder implementation that would work with the updated types

import { Tone, Length } from "@/components/text-rewriter/types";

export async function* streamTextRewrite(
  text: string,
  tone: Tone,
  length: Length,
  apiKey: string
): AsyncGenerator<string> {
  const url = "https://api.openai.com/v1/chat/completions";
  
  const systemPrompt = `You are an expert text rewriter. Rewrite the provided text with the following characteristics:
- Tone: ${tone} (${tone === 'Professional' ? 'formal, business-like' : 'informal, conversational'})
- Length: ${length} (${length === 'Shorter' ? 'more concise than the original' : 'more detailed than the original'})
Maintain the original meaning and key information while adjusting the style as requested.`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text }
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines from the buffer
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
        
        try {
          // Extract the data part
          const jsonStr = trimmedLine.replace(/^data: /, "");
          const json = JSON.parse(jsonStr);
          
          // Extract content from the delta
          const content = json.choices[0]?.delta?.content || "";
          if (content) {
            accumulatedText += content;
            yield accumulatedText;
          }
        } catch (e) {
          console.error("Error parsing JSON from stream:", e);
        }
      }
    }
  } catch (error) {
    console.error("Error in streamTextRewrite:", error);
    throw error;
  }
}
