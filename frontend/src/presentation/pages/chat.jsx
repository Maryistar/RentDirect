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
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ Conectado:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  // 🔹 JOIN CHAT
  useEffect(() => {
    if (!id) return;

    if (socket.connected) {
      socket.emit("join", { chatId: id });
    } else {
      socket.on("connect", () => {
        socket.emit("join", { chatId: id });
      });
    }

  }, [id]);

  // 🔹 ESCUCHAR MENSAJES
  useEffect(() => {

    const handleMessage = (message) => {
      if (message.chatId == id) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };

  }, [id]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 LOADS
  const loadChats = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/v1/chats",
      { headers: { Authorization: `Bearer ${token}` } }
    );
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

    const res = await axios.get(
      `http://localhost:4000/api/v1/chats/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

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

  useEffect(() => { loadChats(); }, []);
  useEffect(() => { loadMessages(); }, [id]);
  useEffect(() => { loadChatInfo(); }, [id]);
  useEffect(() => { loadContract(); }, [id]);

  // ✅ ENVIAR MENSAJE
  const sendMessage = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    socket.emit("sendMessage", {
      chatId: id,
      message: text,
      sender_id: user?.id,
      name: user?.name
    });

    setText("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", paddingTop: "90px", background: "#eef2f7" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "300px",
        background: "#fff",
        borderRight: "1px solid #ddd",
        padding: "15px",
        overflowY: "auto"
      }}>
        <h3>Chats</h3>

        {chats.map(chat => (
          <Link key={chat.id} to={`/chat/${chat.id}`}>
            <div style={{ marginBottom: "10px" }}>
              <strong>{chat.name}</strong><br />
              <span style={{ fontSize: "12px", color: "gray" }}>
                {chat.lastMessage || "Sin mensajes"}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {id ? (
          <>
            <div style={{
              padding: "15px",
              borderBottom: "1px solid #ddd",
              background: "#fff"
            }}>
              <h3>Chat #{id}</h3>
            </div>

            {/* MENSAJES */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>

              {messages.map((msg, index) => {
                const senderId = msg.sender_id || msg.senderId;
                const isMe = senderId === user?.id;

                return (
                  <div
                    key={`${msg.id || index}-${msg.createdAt || Date.now()}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start"
                    }}
                  >
                    <div style={{
                      background: isMe ? "#4CAF50" : "#fff",
                      color: isMe ? "#fff" : "#000",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      maxWidth: "60%"
                    }}>
                      <div style={{ fontSize: "11px", opacity: 0.7 }}>
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
              padding: "10px",
              background: "#fff",
              borderTop: "1px solid #ddd"
            }}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: "1px solid #ccc"
                }}
              />

              <button type="submit">
                Enviar
              </button>
            </form>

          </>
        ) : (
          <p style={{ padding: "20px" }}>Selecciona un chat</p>
        )}

      </div>

    </div>
  );
}

export default Chat;