
import { Tone, Length } from "@/components/text-rewriter/types";

export async function* streamTextRewrite(
  text: string,
  tone: Tone,
  length: Length,
  apiKey: string
): AsyncGenerator<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that rewrites text. Rewrite the provided text with a ${tone.toLowerCase()} tone and make it ${length.toLowerCase()} than the original.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error?.message || `HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try {
            const data = JSON.parse(line.substring(6));
            const content = data.choices[0]?.delta?.content || "";
            if (content) {
              buffer += content;
              yield buffer;
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in streamTextRewrite:", error);
    throw error;
  }
}
