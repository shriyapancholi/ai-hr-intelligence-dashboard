import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import API from "../services/api";

const suggestions = [
  "Show burnout risk",
  "Employee sentiment trend",
  "Who might leave the company?",
  "Which teams have meeting overload?",
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Hello! I'm HR Intel AI. Ask me about employee sentiment, burnout risk, retention trends, or meeting analytics." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setTyping(true);

    try {
      const { data } = await API.post("ai/chat", { message: msg });
      setMessages((prev) => [...prev, { sender: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "assistant", text: "Sorry, I'm unable to respond right now. Please ensure ANTHROPIC_API_KEY is configured." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div className="card" style={{ marginBottom: "16px" }}>
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sparkles size={18} /><h3>AI Assistant</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div ref={chatRef} style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "65%", padding: "12px 16px", borderRadius: "12px", background: msg.sender === "user" ? "var(--primary)" : "var(--gray-100)", color: msg.sender === "user" ? "#fff" : "var(--gray-800)", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && <div style={{ color: "var(--gray-500)", fontSize: "13px" }}>AI is typing...</div>}
        </div>

        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--gray-200)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {suggestions.map((s, i) => (
            <button key={i} className="btn btn-outline" onClick={() => sendMessage(s)} style={{ fontSize: "12px", padding: "6px 10px" }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ padding: "12px", borderTop: "1px solid var(--gray-200)", display: "flex", gap: "10px" }}>
          <input
            className="form-input"
            placeholder="Ask AI about employees, sentiment, meetings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary" onClick={() => sendMessage()} disabled={typing}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
