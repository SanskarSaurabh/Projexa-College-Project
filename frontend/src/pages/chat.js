import { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import { getChatHistory, getChatUsers } from "../api/ChatApi";
import "./Chat.css";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getChatUsers();
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Join personal room when user is available
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // Listen for incoming messages
  useEffect(() => {
    const handleMessage = (msg) => {
      // Only add message if it's part of the current conversation
      const isFromSelected = msg.sender === selectedUser?._id;
      const isFromMe = msg.sender === user?._id;

      if (isFromSelected || isFromMe) {
        setMessages((prev) => {
          // Prevent duplicates by checking ID (if DB returns it)
          if (prev.find((m) => m._id === msg._id && msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receiveMessage", handleMessage);

    // CLEANUP: Important to prevent duplicate messages
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [selectedUser, user]);

  const openChat = async (u) => {
    setSelectedUser(u);
    try {
      const res = await getChatHistory(u._id);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    const messageData = {
      sender: user._id,
      receiver: selectedUser._id,
      text: text.trim(),
    };

    // Emit to server
    socket.emit("sendMessage", messageData);

    // NOTE: We no longer setMessages here manually. 
    // The socket listener above will handle it when the server broadcasts it back.
    setText("");
  };

  return (
    <div className="chat-wrapper">
      <Navbar />
      <div className="container py-4 chat-main-container">
        <div className="row g-0 chat-glass-card shadow-lg">
          
          {/* Sidebar */}
          <div className="col-md-4 chat-sidebar border-end border-dark">
            <div className="p-4 border-bottom border-dark">
              <h5 className="m-0 fw-bold text-white">Messages</h5>
            </div>
            <div className="user-list overflow-auto">
              {users.map((u) => (
                <div
                  key={u._id}
                  className={`user-item d-flex align-items-center p-3 ${selectedUser?._id === u._id ? "active-user" : ""}`}
                  onClick={() => openChat(u)}
                >
                  <div className="avatar-chat me-3">{u.name.charAt(0)}</div>
                  <div className="user-meta">
                    <p className="m-0 text-white fw-semibold small">{u.name}</p>
                    <span className="smaller text-silver-muted">{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-md-8 d-flex flex-column chat-window">
            {selectedUser ? (
              <>
                <div className="chat-header p-3 border-bottom border-dark d-flex align-items-center">
                  <div className="avatar-chat sm me-2">{selectedUser.name.charAt(0)}</div>
                  <h6 className="m-0 text-white">{selectedUser.name}</h6>
                </div>

                <div className="messages-area p-4 overflow-auto flex-grow-1">
                  {messages.map((m, i) => (
                    <div key={i} className={`message-bubble-wrapper d-flex ${m.sender === user._id ? "justify-content-end" : "justify-content-start"}`}>
                      <div className={`message-bubble ${m.sender === user._id ? "bg-indigo-msg" : "bg-slate-msg"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area p-3 border-top border-dark">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control chat-input-field"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                    />
                    <button className="btn btn-indigo-send" onClick={sendMessage}>
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 empty-chat">
                <i className="bi bi-chat-dots display-1 text-dark-subtle mb-3"></i>
                <p className="text-silver-muted">Select a peer to start collaborating</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;