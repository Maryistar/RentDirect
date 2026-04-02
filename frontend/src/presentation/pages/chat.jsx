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

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      console.log("✅ Conectado:", socket.id);
    });
  }, []);

  const loadChatInfo = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/chats/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatInfo(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadChatInfo(); }, [id]);

  const loadContract = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/contracts/chat/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract(res.data);
    } catch {
      console.log("No hay contrato aún");
    }
  };

  useEffect(() => { loadContract(); }, [id]);

  const loadChats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/chats",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMessages = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/chats/${id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadChats(); }, []);
  useEffect(() => { loadMessages(); }, [id]);

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

  useEffect(() => {
    const handleMessage = (message) => {
      // Usamos comparación flexible para el ID del chat
      if (message.chatId == id) {
        setMessages(prev => {
          // Verificación de seguridad simple para no repetir el mismo ID de la base de datos
          if (message.id && prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("newMessage", handleMessage);
    return () => socket.off("newMessage", handleMessage);

  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // 🔥 FIX: Eliminamos el setMessages manual de aquí.
    // El mensaje aparecerá en pantalla cuando el socket lo reciba y lo devuelva a través de 'handleMessage'.

    socket.emit("sendMessage", {
      chatId: id,
      message: text,
      sender_id: user?.id,
      name: user?.name
    });

    setText("");
  };

  const handleAgree = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/applications/${chatInfo.applicationId}`,
        { status: "agreed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadChatInfo();
      await loadChats();
      alert("✅ Aplicación aceptada");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptContract = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/contracts/${contract.id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Contrato aceptado");
      await loadContract();
    } catch (error) {
      console.error(error);
      alert("❌ Error al aceptar contrato");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", paddingTop: "90px", background: "#eef2f7" }}>
      <div style={{ width: "300px", background: "#fff", borderRight: "1px solid #ddd", padding: "15px", overflowY: "auto" }}>
        <h3>Chats</h3>
        {chats.map(chat => {
          const displayName =
            chat.name ||
            chat.tenant_name ||
            chat.owner_name ||
            chat.username ||
            (isOwner ? "Inquilino" : "Propietario");

          return (
            <Link key={chat.id} to={`/chat/${chat.id}`} style={{ textDecoration: "none" }}>
              <div style={{ padding: "10px", borderRadius: "10px", marginBottom: "10px", transition: "0.2s", color: "#000" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f1f1"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <strong>{displayName}</strong><br />
                <span style={{ fontSize: "12px", color: "gray" }}>
                  {chat.lastMessage || "Sin mensajes"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {id ? (
          <>
            <div style={{ padding: "15px", borderBottom: "1px solid #ddd", background: "#fff", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h3>Chat #{id}</h3>
              {isOwner && chatInfo?.applicationStatus === "in_review" && (
                <button onClick={handleAgree} style={btnGreen}>Aceptar inquilino</button>
              )}
              {isOwner && chatInfo?.applicationStatus === "agreed" && (
                <button onClick={() => window.location.href = `/contract/${id}`} style={btnBlue}>Crear contrato</button>
              )}
              {!isOwner && contract && (
                <div>
                  <h4 style={{ cursor: "pointer", color: "#2196F3" }} onClick={() => window.open(`http://localhost:4000/api/v1/contracts/${contract.id}/pdf`)}>📄 Descargar contrato</h4>
                  <button onClick={handleAcceptContract} style={btnGreen}>Aceptar contrato</button>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map((msg, index) => {
                const isMe = msg.sender_id === user?.id || msg.senderId === user?.id || msg.userId === user?.id;
                return (
                  <div key={msg.id || index} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", animation: "fadeIn 0.3s" }}>
                    <div style={{ background: isMe ? "#4CAF50" : "#fff", color: isMe ? "#fff" : "#000", padding: "10px 15px", borderRadius: "15px", maxWidth: "60%", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                      <div style={{ fontSize: "11px", opacity: 0.7 }}>{msg.name || msg.username || "Usuario"}</div>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>

            <form onSubmit={sendMessage} style={{ display: "flex", padding: "10px", background: "#fff", borderTop: "1px solid #ddd" }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un mensaje..."
                style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }} />
              <button type="submit" style={btnGreen}>Enviar</button>
            </form>
          </>
        ) : (
          <p style={{ padding: "20px" }}>Selecciona un chat</p>
        )}
      </div>
      <style>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } `}</style>
    </div>
  );
}

const btnGreen = { background: "#4CAF50", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", marginTop: "5px" };
const btnBlue = { background: "#2196F3", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", marginTop: "5px" };

export default Chat;