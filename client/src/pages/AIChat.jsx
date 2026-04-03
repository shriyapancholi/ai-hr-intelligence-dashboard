import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello! I'm HR Intel AI. Ask me about employee sentiment, burnout risk, retention trends, or meeting analytics.",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const suggestions = [
    "Show burnout risk",
    "Employee sentiment trend",
    "Who might leave company?",
    "Meeting overload teams",
  ];

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Fake AI response
    setTimeout(() => {
      const aiMessage = {
        sender: "assistant",
        text:
          "Based on recent analytics, the Engineering team shows increased meeting load and burnout risk. Sentiment dropped by 6% this month.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>

      {/* Header */}
      <div className="card" style={{ marginBottom: "16px" }}>
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sparkles size={18} />
            <h3>AI Assistant</h3>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div
        className="card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Messages */}
        <div
          ref={chatRef}
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background:
                    msg.sender === "user"
                      ? "var(--primary)"
                      : "var(--gray-100)",
                  color: msg.sender === "user" ? "#fff" : "var(--gray-800)",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ color: "var(--gray-500)", fontSize: "13px" }}>
              AI is typing...
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--gray-200)",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="btn btn-outline"
              onClick={() => setInput(s)}
              style={{ fontSize: "12px", padding: "6px 10px" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid var(--gray-200)",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            className="form-input"
            placeholder="Ask AI about employees, sentiment, meetings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button className="btn btn-primary" onClick={sendMessage}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}