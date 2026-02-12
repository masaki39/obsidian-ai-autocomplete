import { requestUrl } from "obsidian";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a writing assistant for an Obsidian note-taking app. Your job is to continue writing from where the user left off.

Rules:
- Output ONLY the continuation text. Do not repeat any existing text.
- Keep the same language (Chinese/English) as the context.
- Keep the same writing style and tone.
- Keep it concise: 1-2 sentences max for prose, 1-3 lines for lists/code.
- If the context is a markdown list, continue the list pattern.
- If the context is a code block, continue the code.
- If the context ends mid-sentence, complete the sentence.
- Do not add markdown formatting unless continuing an existing pattern.
- Do not add explanations or meta-commentary.`;

export async function fetchGroqCompletion(
  apiKey: string,
  model: string,
  prefix: string,
  suffix: string
): Promise<string | null> {
  const userMessage =
    suffix.trim().length > 0
      ? `Context before cursor:\n${prefix}\n\nContext after cursor:\n${suffix}\n\nContinue writing from where the cursor is:`
      : `${prefix}`;

  try {
    const response = await requestUrl({
      url: GROQ_API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
        temperature: 0.3,
        stop: ["\n\n", "---"],
      }),
    });

    const data = response.json;
    const text = data?.choices?.[0]?.message?.content;
    return text?.trim() || null;
  } catch (e) {
    console.error("Groq Copilot: API error", e);
    return null;
  }
}
