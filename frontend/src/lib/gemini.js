import { COMPANY, CLIENTS, PRODUCTS } from "../data/site";

export const buildRockySystemPrompt = () => {
  const catalogLines = PRODUCTS.map((p) => {
    let line = `- ${p.name} [${p.category}]: ${p.blurb}`;
    if (p.variants && p.variants.length > 0) {
      line += ` Variants: ${p.variants.join(", ")}.`;
    }
    return line;
  }).join("\n");

  return `You are Rocky, the AI packaging assistant for Al Lulu Packaging (${COMPANY.legalName}), a B2B packaging supplier in ${COMPANY.address} since ${COMPANY.established}.

STRICT RULES:
- Reply in maximum 2–3 short sentences. Be direct and helpful. Never write long paragraphs.
- Never invent prices, lead times, certifications, or stock levels — they're not listed here.
- If asked about pricing, delivery, or ordering: say you can't quote specifics and prompt them to contact via WhatsApp (+971 6 530 0865) or Request a Quote.
- If you don't know something, say: "I'm not sure — please chat with our team on WhatsApp for a quick answer."
- Do not claim partnerships or endorsements.

COMPANY FACTS:
- Name: ${COMPANY.name}
- Location: ${COMPANY.fullAddress}
- Phone/WhatsApp: ${COMPANY.phoneIntl}
- Email: ${COMPANY.emailPrimary} / ${COMPANY.emailSecondary}
- B2B quotation-based business. Not an online store.
- Clients supplied include: ${CLIENTS.join(", ")}

PRODUCT CATALOGUE:
${catalogLines}

TONE: Short, warm, professional B2B. Guide users to ask about product type, size, and quantity so they can get a formal quote.`;
};

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash";

export async function streamGeminiChat({ messages, onDelta, apiKey }) {
  const key = apiKey || process.env.REACT_APP_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API key is not configured.");
  }

  const contents = [];
  for (const m of messages) {
    if (m.role === "user") {
      contents.push({ role: "user", parts: [{ text: m.content }] });
    } else if (m.role === "assistant" && m.content) {
      contents.push({ role: "model", parts: [{ text: m.content }] });
    }
  }

  if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
    return;
  }

  const systemInstruction = {
    parts: [{ text: buildRockySystemPrompt() }],
  };

  const response = await fetch(`${GEMINI_API_URL}:streamGenerateContent?alt=sse&key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  if (!response.body) {
    throw new Error("No response body received from Gemini.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const jsonStr = trimmed.slice(6);
      if (!jsonStr) continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textChunk && onDelta) {
          onDelta(textChunk);
        }
      } catch {
        // Skip malformed chunk
      }
    }
  }
}
