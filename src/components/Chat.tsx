import { useState, useRef, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export function Chat() {
  const [messages, setMessages] = useState<
    { role: string; content: string; timestamp: Date }[]
  >([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const userMessage = { role: "user", content: input, timestamp: now };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsBotTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsBotTyping(false);

      const botMessage = {
        role: "bot",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      await addDoc(collection(db, "sessions"), {
        userMessage: input,
        botReply: data.reply,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Chat error:", error);
      setIsBotTyping(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  return (
    <div className="chat-container">
      <h2 className="chat-heading">Current Chat</h2>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <p>
              <span className="timestamp">{msg.timestamp.toLocaleString()}</span>{" "}
              <strong>{msg.role === "user" ? "You" : "LANGUAGE Bot"}:</strong>{" "}
              {msg.content}
            </p>
          </div>
        ))}

        {isBotTyping && (
          <div className="message bot">
            <p>
              <span className="timestamp">{new Date().toLocaleTimeString()}</span>{" "}
              <strong>LANGUAGE Bot:</strong> <em>Typing...</em>
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <input
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message and hit Enter..."
      />
    </div>
  );
}
