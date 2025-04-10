
"use server";

import OpenAI from "openai";

export const streamTextRewrite = async function* (
  text: string,
  tone: string,
  length: string,
  apiKey: string
) {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `Rewrite the following text with a ${tone.toLowerCase()} tone. 
  Make it ${length.toLowerCase()} than the original while preserving the core meaning.
  Return only the rewritten text without any additional commentary or formatting.`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: text,
      },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    yield content;
  }
};
