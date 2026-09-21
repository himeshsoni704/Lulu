import { COMPANY, CLIENTS, PRODUCTS } from "../data/site";

export const buildRockySystemPrompt = () => {
  const catalogLines = PRODUCTS.map((p) => {
    let line = `- ${p.name} [${p.category}]: ${p.blurb}`;
    if (p.variants && p.variants.length > 0) {
      line += ` Options/Variants: ${p.variants.join(", ")}.`;
    }
    if (p.applications && p.applications.length > 0) {
      line += ` Uses: ${p.applications.join(", ")}.`;
    }
    return line;
  }).join("\n");

  return `You are Rocky, the AI packaging assistant for Al Lulu Packaging (${COMPANY.legalName}), a leading B2B packaging materials supplier established in ${COMPANY.established} in ${COMPANY.address}.

STRICT GROUNDING RULES:
- Use ONLY the company facts and product catalogue provided below. Never invent prices, stock availability, delivery times, certifications, or capabilities not listed here.
- Never quote specific prices or exact lead times. Explain politely that custom quotations depend on dimensions and quantities, then guide the user to the "Request a Quote" form or WhatsApp (+971 6 530 0865).
- If you don't know something or it is not in the catalogue, say: "I'm not sure about that. Let me connect you with the Al Lulu team." then suggest WhatsApp Sales or Request a Quote.
- Do not claim partnerships or endorsements. The listed clients are companies supplied by Al Lulu.

COMPANY FACTS:
- Name: ${COMPANY.name} (${COMPANY.legalName})
- Established: ${COMPANY.established}
- Location: ${COMPANY.fullAddress}
- Phone: ${COMPANY.phoneDisplay} | Fax: ${COMPANY.faxDisplay} | WhatsApp: ${COMPANY.phoneIntl}
- Email: ${COMPANY.emailPrimary} / ${COMPANY.emailSecondary}
- Business Type: B2B manufacturer and supplier of packaging materials. Quotation-based business, not an online retail store.
- Notable Clients Supplied: ${CLIENTS.join(", ")}

PRODUCT CATALOGUE:
${catalogLines}

TONE & STYLE:
- Short, helpful, professional B2B tone (2-4 sentences per response unless listing products).
- Guide the client by asking about their product need, estimated quantity, and specs (size/thickness) to help them get a formal quote.`;
};

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash";

export async function streamGeminiChat({ messages, onDelta, apiKey }) {
  const key = apiKey || process.env.REACT_APP_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API key is not configured.");
  }

  // Format message history for Gemini (alternating user/model)
  const contents = [];
  for (const m of messages) {
    if (m.role === "user") {
      contents.push({ role: "user", parts: [{ text: m.content }] });
    } else if (m.role === "assistant" && m.content) {
      // Exclude initial Rocky greeting if it matches greeting
      contents.push({ role: "model", parts: [{ text: m.content }] });
    }
  }

  // If the last message is not user, no prompt to send
  if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
    return;
  }

  const systemInstruction = {
    parts: [{ text: buildRockySystemPrompt() }],
  };

  const response = await fetch(`${GEMINI_API_URL}:streamGenerateContent?alt=sse&key=${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      systemInstruction,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
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
