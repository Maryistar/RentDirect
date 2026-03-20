import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../../socket";
import { motion, AnimatePresence } from "framer-motion";

function Chat() {
  const { id } = useParams();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageStatus, setMessageStatus] = useState("");

  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");

  // ✅ USER SEGURO (NO ROMPE useEffect)
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = Number(userData.id || 0);
  const userName = userData.name || "Yo";

  // 🔹 cargar chats
  const loadChats = async () => {
    const res = await axios.get("http://localhost:4000/api/v1/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data);
  };

  // 🔹 cargar mensajes
  const loadMessages = async () => {
    if (!id) return;

    const res = await axios.get(
      `http://localhost:4000/api/v1/chats/${id}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages(res.data);
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [id]);

  // 🔹 usuario online
  useEffect(() => {
    if (userId) {
      socket.emit("userOnline", userId);
    }
  }, [userId]);

  // 🔹 escuchar usuarios online
  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("onlineUsers");
  }, []);

  // 🔹 join chat
  useEffect(() => {
    if (id) socket.emit("join", { chatId: id });
  }, [id]);

  // 🔹 typing
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", { chatId: id, userId });

    setTimeout(() => {
      socket.emit("stopTyping", { chatId: id });
    }, 1000);
  };

  // 🔹 escuchar typing
  useEffect(() => {
    socket.on("typing", (user) => {
      setTypingUser(user);
    });

    socket.on("stopTyping", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  // 🔹 estado mensajes ✔✔
  useEffect(() => {
    socket.on("messageSent", () => {
      setMessageStatus("✔ Enviado");
    });

    socket.on("messageDelivered", () => {
      setMessageStatus("✔✔ Recibido");
    });

    return () => {
      socket.off("messageSent");
      socket.off("messageDelivered");
    };
  }, []);

  // 🔥 FIX useEffect (SIN ERROR + TIEMPO REAL)
  useEffect(() => {
    const handleNewMessage = (message) => {
      const newMessage = {
        id: message.id || Date.now(),
        sender_id: Number(message.senderId),
        message: message.message,
        created_at: message.createdAt,
        name:
          Number(message.senderId) === Number(userId)
            ? userName
            : "Usuario",
      };

      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [id, userId]);

  // 🔹 scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 enviar mensaje
  const sendMessage = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    socket.emit("sendMessage", {
      chatId: id,
      message: text,
      senderId: userId,
    });

    setText("");
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const currentChat = chats.find(c => String(c.id) === String(id));

  return (
    <div className="flex h-screen pt-[80px] bg-gray-100">

      {/* 🔹 SIDEBAR */}
      <div className="w-[300px] bg-white border-r overflow-y-auto shadow-sm">
        <h2 className="p-4 font-bold text-lg">Chats</h2>

        {chats.map(chat => (
          <Link key={chat.id} to={`/chat/${chat.id}`}>
            <div className="p-4 border-b hover:bg-gray-100 transition cursor-pointer">

              <div className="flex justify-between items-center">
                <span className="font-semibold">{chat.name}</span>
                <span className="text-xs text-gray-400">
                  {chat.lastMessageTime &&
                    new Date(chat.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>

              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage || "Sin mensajes"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔹 CHAT */}
      <div className="flex-1 flex flex-col">

        {id ? (
          <>
            {/* 🔹 HEADER */}
            <div className="p-4 bg-white shadow flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {getInitial(currentChat?.name)}
                </div>

                <div>
                  <h3 className="font-semibold">{currentChat?.name}</h3>

                  {onlineUsers.includes(String(currentChat?.id)) && (
                    <span className="text-green-500 text-xs">● En línea</span>
                  )}
                </div>
              </div>

            </div>

            {/* 🔹 MENSAJES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isMine =
                    Number(msg.sender_id) === Number(userId);

                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-end gap-2 max-w-[70%]">

                        {!isMine && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                            {getInitial(msg.name)}
                          </div>
                        )}

                        <div
                          className={`px-4 py-2 rounded-2xl shadow-md text-sm
                          ${isMine
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-black rounded-bl-none"
                            }`}
                        >

                          {!isMine && (
                            <div className="text-xs text-gray-400 mb-1">
                              {msg.name}
                            </div>
                          )}

                          {msg.message}

                          {isMine && (
                            <div className="text-xs text-right mt-1 opacity-70">
                              {messageStatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* typing */}
              {typingUser && (
                <p className="text-sm text-gray-400 italic">
                  Escribiendo...
                </p>
              )}

              <div ref={bottomRef}></div>
            </div>

            {/* 🔹 INPUT */}
            <form
              onSubmit={sendMessage}
              className="p-4 bg-white flex gap-2 border-t"
            >
              <input
                type="text"
                value={text}
                onChange={handleTyping}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 text-white px-5 py-2 rounded-full"
              >
                Enviar
              </motion.button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecciona un chat
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;