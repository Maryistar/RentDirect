import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Chat() {

  const { id } = useParams();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  // cargar lista de chats
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

  // cargar mensajes
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

  // enviar mensaje
  const sendMessage = async (e) => {

    e.preventDefault();

    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender_id: "yo",
      message: text
    };

    // agregar mensaje instantáneamente
    setMessages(prev => [...prev, newMessage]);

    try {

      await axios.post(
        `http://localhost:4000/api/v1/chats/messages`,
        {
          chatId: id,
          content: text
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setText("");

    } catch (error) {
      console.error(error);
    }
  };

  return (

    <div style={{ display: "flex", height: "80vh" }}>

      {/* LISTA DE CHATS */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid gray",
          padding: "10px"
        }}
      >

        <h3>Chats</h3>

        {chats.map(chat => (
          <div key={chat.id} style={{ marginBottom: "10px" }}>
            <Link to={`/chat/${chat.id}`}>
              Chat #{chat.id}
            </Link>
          </div>
        ))}

      </div>


      {/* MENSAJES */}
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
                  <strong>{msg.name}:</strong> {msg.message}
                </p>
              ))}

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