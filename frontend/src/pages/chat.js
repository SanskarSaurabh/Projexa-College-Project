import { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import {
  getChatHistory,
  getChatUsers,
  deleteChatHistory,
} from "../api/ChatApi";
import "./Chat.css";

const Chat = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const messagesEndRef = useRef(null);

  /* ================= SCROLL ================= */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getChatUsers();
        setUsers(res.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  /* ================= JOIN ROOM ================= */

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  /* ================= RECEIVE MESSAGE ================= */

  useEffect(() => {
    const handleMessage = (msg) => {
      const senderId = msg.sender?.toString();
      const receiverId = msg.receiver?.toString();
      const myId = user?._id?.toString();
      const openedChatId = selectedUser?._id?.toString();

      const isCurrentChat =
        (senderId === openedChatId && receiverId === myId) ||
        (senderId === myId && receiverId === openedChatId);

      /* ===== MESSAGE FOR OPEN CHAT ===== */

      if (isCurrentChat) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;

          return [...prev, msg];
        });
      }

      /* ===== MESSAGE FOR CLOSED CHAT ===== */

      if (receiverId === myId && senderId !== openedChatId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => socket.off("receiveMessage", handleMessage);
  }, [selectedUser, user]);

  /* ================= OPEN CHAT ================= */

  const openChat = async (u) => {
    setSelectedUser(u);

    /* reset unread counter */

    setUnreadCounts((prev) => ({
      ...prev,
      [u._id]: 0,
    }));

    try {
      const res = await getChatHistory(u._id);
      setMessages(res.data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= SEND MESSAGE ================= */

  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      sender: user._id,
      receiver: selectedUser._id,
      text: text.trim(),
    });

    setText("");
  };

  /* ================= DELETE CHAT ================= */

  const handleDeleteChat = async () => {
    if (!selectedUser) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat history?"
    );

    if (!confirmDelete) return;

    try {
      await deleteChatHistory(selectedUser._id);
      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= DATE FORMAT ================= */

  const formatDateTime = (date) => {
    const d = new Date(date);

    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const day = d.toLocaleDateString();

    return `${day} • ${time}`;
  };

  return (
    <div className="campus-view-root">

      <Navbar />

      <main className="chat-interface-wrapper">

        <div className="chat-glass-panel">

          <div className="row g-0 h-100">

            {/* ================= SIDEBAR ================= */}

            <div className="col-md-4 chat-sidebar border-end">

              <div className="sidebar-brand-box">
                <h5>Messages</h5>
                <span className="online-tag">
                  Campus Live
                </span>
              </div>

              <div className="user-scroller">

                {users.map((u) => (

                  <div
                    key={u._id}
                    className={`user-pill ${
                      selectedUser?._id === u._id
                        ? "pill-active"
                        : ""
                    }`}
                    onClick={() => openChat(u)}
                  >

                    <div className="avatar-box">
                      {u.name.charAt(0)}
                    </div>

                    <div className="user-info-text">
                      <p className="m-0 fw-bold">{u.name}</p>
                      <small>{u.role}</small>
                    </div>

                    {unreadCounts[u._id] > 0 && (
                      <div className="unread-badge">
                        +{unreadCounts[u._id]}
                      </div>
                    )}

                  </div>

                ))}

              </div>

            </div>

            {/* ================= CHAT WINDOW ================= */}

            <div className="col-md-8 d-flex flex-column chat-viewport">

              {selectedUser ? (

                <>

                  <div className="viewport-header d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center">

                      <div className="avatar-sm">
                        {selectedUser.name.charAt(0)}
                      </div>

                      <div>
                        <h6 className="m-0 fw-bold">
                          {selectedUser.name}
                        </h6>
                        <small className="active-dot">
                          Connected
                        </small>
                      </div>

                    </div>

                    <button
                      onClick={handleDeleteChat}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete Chat
                    </button>

                  </div>

                  {/* ================= MESSAGES ================= */}

                  <div className="messages-flow">

                    {messages.map((m) => {

                      const isMe =
                        m.sender?.toString() ===
                        user._id?.toString();

                      return (

                        <div
                          key={m._id}
                          className={`msg-wrapper ${
                            isMe
                              ? "msg-me"
                              : "msg-them"
                          }`}
                        >

                          <div>

                            <div className="msg-bubble">
                              {m.text}
                            </div>

                            <div
                              style={{
                                fontSize: "11px",
                                marginTop: "4px",
                                color: "#94a3b8",
                                textAlign: isMe
                                  ? "right"
                                  : "left",
                              }}
                            >
                              {formatDateTime(m.createdAt)}
                            </div>

                          </div>

                        </div>

                      );
                    })}

                    <div ref={messagesEndRef}></div>

                  </div>

                  {/* ================= INPUT ================= */}

                  <div className="viewport-footer">

                    <div className="input-pill">

                      <input
                        value={text}
                        onChange={(e) =>
                          setText(e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          sendMessage()
                        }
                        placeholder="Write a message..."
                      />

                      <button
                        onClick={sendMessage}
                        className="send-btn"
                      >
                        Send
                      </button>

                    </div>

                  </div>

                </>

              ) : (

                <div className="chat-empty-state">
                  <div className="empty-icon">K</div>
                  <p>
                    Select a peer to start chatting
                  </p>
                </div>

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Chat;