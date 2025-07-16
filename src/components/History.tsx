import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

type Message = {
  role: string;
  content: string;
  timestamp: Date;
};

export function History() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    const q = query(collection(db, "sessions"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const loadedMessages: Message[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.userMessage) {
        loadedMessages.push({
          role: "user",
          content: data.userMessage,
          timestamp: data.timestamp.toDate(),
        });
      }
      if (data.botReply) {
        loadedMessages.push({
          role: "bot",
          content: data.botReply,
          timestamp: data.timestamp.toDate(),
        });
      }
    });

    setMessages(loadedMessages);
    setLoading(false);
  };

  const deleteHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all chat history?")) return;

    setLoading(true);
    const q = query(collection(db, "sessions"));
    const querySnapshot = await getDocs(q);
    const deletions = querySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "sessions", docSnap.id))
    );

    await Promise.all(deletions);
    setMessages([]);
    setLoading(false);
    alert("Chat history deleted.");
  };

  useEffect(() => {
    if (visible) {
      fetchHistory();
    }
  }, [visible]);

  return (
    <div className="history-container">
      <button onClick={() => setVisible((v) => !v)} className="toggle-button">
        {visible ? "Hide Chat History" : "Show Chat History"}
      </button>

      {visible && (
        <div className="history-content">
          <div className="history-header">
            <h2>Chat History</h2>
            <button
              onClick={deleteHistory}
              disabled={loading}
              className="delete-button"
            >
              Delete History
            </button>
          </div>

          <div className="messages-list">
            {loading ? (
              <p>Loading...</p>
            ) : messages.length === 0 ? (
              <p className="no-history">No chat history found.</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <p>
                    <span className="timestamp">
                      {msg.timestamp.toLocaleString()}
                    </span>{" "}
                    <strong>
                      {msg.role === "user" ? "You" : "LANGUAGE Bot"}:
                    </strong>{" "}
                    {msg.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
