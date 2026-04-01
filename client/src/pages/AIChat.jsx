import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I’m your HR AI assistant 🤖" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    const newMessages = [
      ...messages,
      { sender: "user", text: input },
      { sender: "ai", text: "AI response coming soon..." }
    ];

    setMessages(newMessages);
    setInput("");
  };

  return (
    <div style={{ display: "flex", background: "#f1f5f9" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={container}>
          <h2 style={{ marginBottom: 20 }}>AI HR Assistant</h2>

          {/* Chat Box */}
          <div style={chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div
                  style={{
                    ...bubble,
                    background:
                      msg.sender === "user" ? "#2563eb" : "#e2e8f0",
                    color: msg.sender === "user" ? "white" : "#0f172a"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={inputBox}>
            <input
              placeholder="Ask something about employees, sentiment..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={inputStyle}
            />

            <button onClick={sendMessage} style={sendBtn}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Styles */

const container = {
  padding: 30
};

const chatBox = {
  background: "white",
  height: "400px",
  overflowY: "auto",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: 10
};

const bubble = {
  padding: "10px 15px",
  borderRadius: "15px",
  maxWidth: "60%"
};

const inputBox = {
  display: "flex",
  marginTop: 15,
  gap: 10
};

const inputStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #cbd5f5"
};

const sendBtn = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8
};