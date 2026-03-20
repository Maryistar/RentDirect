import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../../socket";

function Chat() {

  const { id } = useParams();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");

  // 🔹 cargar lista de chats
  const loadChats = async () => {
    try {

      const res = await axios.get(
        "http://localhost:4000/api/v1/chats",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setChats(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 cargar mensajes
  const loadMessages = async () => {

    if (!id) return;

    try {

      const res = await axios.get(
        `http://localhost:4000/api/v1/chats/${id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [id]);

  // 🔹 unirse al chat (socket)
  useEffect(() => {

    if (id) {
      socket.emit("join", { chatId: id });
    }

  }, [id]);

  // 🔹 escuchar mensajes en tiempo real
  useEffect(() => {

    socket.on("newMessage", (message) => {

      // 🔥 SOLO mensajes del chat actual
      if (message.chatId == id) {
        setMessages(prev => [...prev, message]);
      }

    });

    return () => {
      socket.off("newMessage");
    };

  }, []);

  // 🔹 auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 enviar mensaje
  const sendMessage = async (e) => {

    e.preventDefault();

    if (!text.trim()) return;

    try {

      socket.emit("sendMessage", {
        chatId: id,
        message: text
      });

      setText("");

    } catch (error) {
      console.error(error);
    }
  };

  return (

    <div style={{ display: "flex", height: "100vh", paddingTop: "90px" }}>

      {/* 🔹 LISTA DE CHATS */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid gray",
          padding: "10px",
          overflowY: "auto"
        }}
      >

        <h3>Chats</h3>

        {chats.map(chat => (
          <div key={chat.id} style={{ marginBottom: "15px" }}>
            <Link to={`/chat/${chat.id}`}>

              <strong>{chat.name}</strong><br />

              <span style={{ color: "gray", fontSize: "12px" }}>
                {chat.lastMessage || "Sin mensajes"}
              </span>

              <br />

              <span style={{ float: "right", fontSize: "10px" }}>
                {chat.lastMessageTime &&
                  new Date(chat.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                }
              </span>

            </Link>
          </div>
        ))}

      </div>

      {/* 🔹 MENSAJES */}
      <div style={{ flex: 1, padding: "20px" }}>

        {id ? (
          <>
            <h3>Chat #{id}</h3>

            <div
              style={{
                border: "1px solid gray",
                height: "400px",
                overflowY: "auto",
                padding: "10px",
                marginBottom: "10px"
              }}
            >

              {messages.map(msg => (
                <p key={msg.id}>
                  <strong>{msg.name || "Usuario"}:</strong> {msg.message}
                </p>
              ))}

              {/* 🔥 AUTO SCROLL */}
              <div ref={bottomRef}></div>

            </div>

            <form onSubmit={sendMessage}>

              <input
                type="text"
                value={text}
                placeholder="Escribe un mensaje..."
                onChange={(e) => setText(e.target.value)}
                style={{ width: "80%", marginRight: "10px" }}
              />

              <button type="submit">
                Enviar
              </button>

            </form>
          </>
        ) : (
          <p>Selecciona un chat</p>
        )}

      </div>

    </div>
  );
}

export default Chat;