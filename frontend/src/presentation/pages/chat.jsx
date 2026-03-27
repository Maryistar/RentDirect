import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../../socket";

function Chat() {
  const { id } = useParams();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?.role === "owner";
  const [contract, setContract] = useState(null);

  const bottomRef = useRef(null);
  const token = localStorage.getItem("token");

  // ✅ SOCKET
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => console.log("✅ Conectado:", socket.id));
    return () => socket.off("connect");
  }, []);

  // 🔹 JOIN CHAT
  useEffect(() => {
    if (!id) return;
    if (socket.connected) socket.emit("join", { chatId: id });
    else socket.on("connect", () => socket.emit("join", { chatId: id }));
  }, [id]);

  // 🔹 ESCUCHAR MENSAJES
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.chatId == id) setMessages((prev) => [...prev, message]);
    };
    socket.on("newMessage", handleMessage);
    return () => socket.off("newMessage", handleMessage);
  }, [id]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 LOADS
  const loadChats = async () => {
    const res = await axios.get("http://localhost:4000/api/v1/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data);
  };

  const loadMessages = async () => {
    if (!id) return;
    const res = await axios.get(
      `http://localhost:4000/api/v1/chats/${id}/messages`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages(res.data);
  };

  const loadChatInfo = async () => {
    if (!id) return;
    const res = await axios.get(`http://localhost:4000/api/v1/chats/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChatInfo(res.data);
  };

  const loadContract = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/contracts/chat/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract(res.data);
    } catch {
      console.log("No hay contrato");
    }
  };

  useEffect(() => {
    loadChats();
    loadMessages();
    loadChatInfo();
    loadContract();
  }, [id]);

  // ✅ ENVIAR MENSAJE
  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      chatId: id,
      message: text,
      sender_id: user?.id,
      name: user?.name,
    });
    setText("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f3f8", paddingTop: "90px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "280px",
        background: "#fff",
        borderRight: "1px solid #e0e0e0",
        padding: "20px",
        overflowY: "auto",
        boxShadow: "2px 0 5px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Chats</h2>
        {chats.map(chat => (
          <Link key={chat.id} to={`/chat/${chat.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              marginBottom: "12px",
              padding: "10px",
              borderRadius: "12px",
              background: "#f9f9f9",
              transition: "all 0.2s",
              cursor: "pointer"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#e6f0ff"}
              onMouseLeave={e => e.currentTarget.style.background = "#f9f9f9"}
            >
              <strong style={{ color: "#333" }}>{chat.name}</strong>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                {chat.lastMessage || "Sin mensajes"}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {id ? (
          <>
            <div style={{
              padding: "15px 20px",
              borderBottom: "1px solid #e0e0e0",
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ margin: 0, color: "#333" }}>Chat #{id}</h2>
            </div>

            {/* MENSAJES */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#f0f3f8"
            }}>
              {messages.map((msg, index) => {
                const senderId = msg.sender_id || msg.senderId;
                const isMe = senderId === user?.id;
                return (
                  <div
                    key={`${msg.id || index}-${msg.createdAt || Date.now()}-${index}`}
                    style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}
                  >
                    <div style={{
                      background: isMe ? "#4CAF50" : "#fff",
                      color: isMe ? "#fff" : "#333",
                      padding: "10px 15px",
                      borderRadius: "18px",
                      maxWidth: "60%",
                      boxShadow: isMe ? "0 2px 6px rgba(76,175,80,0.3)" : "0 2px 6px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>
                        {msg.name || "Usuario"}
                      </div>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>

            {/* INPUT */}
            <form onSubmit={sendMessage} style={{
              display: "flex",
              padding: "12px 20px",
              background: "#fff",
              borderTop: "1px solid #e0e0e0"
            }}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "25px",
                  border: "1px solid #ccc",
                  outline: "none",
                  marginRight: "10px",
                  fontSize: "14px",
                  transition: "all 0.2s"
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#4CAF50"}
                onBlur={e => e.currentTarget.style.borderColor = "#ccc"}
              />
              <button type="submit" style={{
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "25px",
                padding: "10px 20px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#43a047"}
                onMouseLeave={e => e.currentTarget.style.background = "#4CAF50"}
              >
                Enviar
              </button>
            </form>
          </>
        ) : (
          <p style={{ padding: "20px", color: "#666" }}>Selecciona un chat</p>
        )}
      </div>
    </div>
  );
}

export default Chat;