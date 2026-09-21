import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Package, Send, X, Sparkles } from "lucide-react";
import { WA_GENERAL } from "../data/site";
import { streamGeminiChat } from "../lib/gemini";

const GREETING = "Hi, I'm Rocky. I can help you find a packaging product, learn about Al Lulu Packaging, or guide you on getting a quotation.";
const FALLBACK = "I'm not sure about that. Let me connect you with the Al Lulu team via WhatsApp or our Request a Quote form.";

const QUICK = [
  { label: "Find a Product", msg: "I'm looking for a packaging product. Can you help me find the right one?" },
  { label: "Request a Quote", action: "quote" },
  { label: "What does Al Lulu do?", msg: "What does Al Lulu Packaging do?" },
  { label: "Talk to Sales", action: "whatsapp" },
];

export default function Rocky() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const sessionRef = useRef(`s-${Math.random().toString(36).slice(2, 12)}`);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("rocky:open", handler);
    return () => window.removeEventListener("rocky:open", handler);
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, streaming]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || streaming) return;
    setInput("");
    const nextMessages = [...messages, { role: "user", content: msg }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      await streamGeminiChat({
        messages: nextMessages,
        onDelta: (delta) => {
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, content: (last.content || "") + delta };
            return copy;
          });
        },
      });
    } catch (err) {
      console.warn("Direct Gemini call error, trying backend fallback:", err);
      let recovered = false;

      if (process.env.REACT_APP_BACKEND_URL) {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rocky/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionRef.current, message: msg }),
          });
          if (res.ok && res.body) {
            const reader = res.body.getReader();
            const dec = new TextDecoder();
            let buf = "";
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              buf += dec.decode(value, { stream: true });
              const parts = buf.split("\n\n");
              buf = parts.pop();
              for (const part of parts) {
                if (!part.startsWith("data: ")) continue;
                const payload = JSON.parse(part.slice(6));
                if (payload.delta) {
                  recovered = true;
                  setMessages((m) => {
                    const copy = [...m];
                    const last = copy[copy.length - 1];
                    copy[copy.length - 1] = { ...last, content: (last.content || "") + payload.delta };
                    return copy;
                  });
                }
              }
            }
          }
        } catch (backendErr) {
          console.error("Backend error:", backendErr);
        }
      }

      if (!recovered) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: FALLBACK };
          return copy;
        });
      }
    } finally {
      setStreaming(false);
    }
  };

  const quickAction = (q) => {
    if (q.action === "quote") { setOpen(false); navigate("/request-quote"); }
    else if (q.action === "whatsapp") { window.open(WA_GENERAL, "_blank"); }
    else send(q.msg);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98, transition: { duration: 0.22 } }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[92px] right-4 sm:right-6 z-50 flex h-[min(68vh,540px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-lg border border-line bg-white shadow-2xl"
            aria-label="Rocky AI packaging assistant"
            data-testid="rocky-ai-chat-panel"
          >
            <header className="grain flex items-center justify-between bg-charcoal px-4 py-3.5 text-bone">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-kraft"><Package className="h-4 w-4" /></span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-extrabold uppercase tracking-wide leading-none">Rocky</p>
                    <span className="inline-flex items-center gap-1 rounded bg-kraft/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-kraft">
                      <Sparkles className="h-2.5 w-2.5" /> Gemini
                    </span>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/60 mt-1">Al Lulu Packaging Assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close Rocky" data-testid="rocky-close"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70 hover:text-bone inline-flex items-center gap-1.5">
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-paper/60 p-4" data-testid="rocky-ai-chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] whitespace-pre-wrap rounded-md px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-kraft text-bone" : "border border-line bg-white text-charcoal"
                  }`}>
                    {m.content || <span className="inline-flex gap-1"><span className="rocky-dot h-1.5 w-1.5 rounded-full bg-charcoal/50" /><span className="rocky-dot h-1.5 w-1.5 rounded-full bg-charcoal/50" /><span className="rocky-dot h-1.5 w-1.5 rounded-full bg-charcoal/50" /></span>}
                  </div>
                </div>
              ))}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2" data-testid="rocky-quick-actions">
                  {QUICK.map((q) => (
                    <button key={q.label} onClick={() => quickAction(q)} data-testid={`rocky-quick-action-${q.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="border border-charcoal/15 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-charcoal hover:text-bone">
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-line bg-white p-3"
              data-testid="rocky-ai-chat-form"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, quantities…"
                aria-label="Message Rocky"
                data-testid="rocky-ai-chat-input"
                className="field flex-1"
              />
              <button type="submit" disabled={streaming || !input.trim()} aria-label="Send message" data-testid="rocky-ai-chat-send"
                className="grid h-10 w-10 shrink-0 place-items-center bg-charcoal text-bone transition-opacity disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Rocky assistant" : "Ask Rocky — AI packaging assistant"}
        data-testid="rocky-ai-chat-toggle"
        className="fixed bottom-[84px] sm:bottom-6 right-4 sm:right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-charcoal text-bone shadow-2xl transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <Package className="h-5 w-5" />}
        {!open && <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-bone bg-tape" aria-hidden="true" />}
      </button>
    </>
  );
}
