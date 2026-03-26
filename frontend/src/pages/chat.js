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

const [totalStudents, setTotalStudents] = useState(0);
const [onlineUsers, setOnlineUsers] = useState([]);
const [typingUser, setTypingUser] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

// NEW GROUP STATES
const [groups, setGroups] = useState([]);
const [selectedGroup, setSelectedGroup] = useState(null);
const [showMembers, setShowMembers] = useState(false);

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
    setTotalStudents(res.data.users.length);

  } catch (error) {

    console.error(error);

  }

};

fetchUsers();

}, []);

/* ================= FETCH GROUPS ================= */

useEffect(() => {

const fetchGroups = async () => {

  try {

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/groups`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const data = await res.json();

    if(data.success){
      setGroups(data.groups);
    }

  } catch (error) {

    console.error(error);

  }

};

fetchGroups();

}, []);

/* ================= ONLINE USERS ================= */

useEffect(() => {

socket.on("onlineUsers", (users) => {

  setOnlineUsers(users);

});

return () => socket.off("onlineUsers");

}, []);

/* ================= FETCH UNREAD ================= */

useEffect(() => {

const fetchUnread = async () => {

  try {

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/unread`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const data = await res.json();

    const counts = {};

    data.unread?.forEach((u) => {
      counts[u._id] = u.count;
    });

    setUnreadCounts(counts);

  } catch (error) {

    console.error(error);

  }

};

fetchUnread();

}, []);

/* ================= JOIN ROOM ================= */

useEffect(() => {

if (user?._id) {
  socket.emit("join", user._id);
}

}, [user]);

/* ================= TYPING ================= */

useEffect(() => {

socket.on("typing", (senderId) => {

  setTypingUser(senderId);

});

socket.on("stopTyping", () => {

  setTypingUser(null);

});

return () => {

  socket.off("typing");
  socket.off("stopTyping");

};

}, []);

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

  if (isCurrentChat) {

    setMessages((prev) => {

      const exists = prev.some((m) => m._id === msg._id);
      if (exists) return prev;

      return [...prev, msg];

    });

  }

  if (receiverId === myId && senderId !== openedChatId) {

    setUnreadCounts((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1,
    }));

  }

  /* MOVE CHAT TO TOP LIKE WHATSAPP */

if (senderId && senderId !== myId) {

setUsers(prev => {

const updated = [...prev];

const index = updated.findIndex(u => u._id === senderId);

if(index !== -1){

const [user] = updated.splice(index,1);

updated.unshift(user);

}

return updated;

});

}

};

socket.on("receiveMessage", handleMessage);

return () => socket.off("receiveMessage", handleMessage);

}, [selectedUser, user]);

/* ================= OPEN CHAT ================= */

const openChat = async (u) => {

setSelectedUser(u);
setSelectedGroup(null);

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

/* ================= OPEN GROUP ================= */

const openGroup = (group) => {

setSelectedGroup(group);
setSelectedUser(null);
setMessages([]);

socket.emit("joinGroup", group._id);

};

/* ================= ADD MEMBER TO GROUP ================= */

const handleAddMemberToGroup = async () => {

if(!selectedGroup) return;

/* show user list */

const list = users.map((u,i)=>`${i+1}. ${u.name}`).join("\n");

const choice = prompt(`Select student number:\n\n${list}`);

if(!choice) return;

const selected = users[parseInt(choice)-1];

if(!selected){
alert("Invalid selection");
return;
}

try{

const res = await fetch(
`${process.env.REACT_APP_API_URL}/chat/group/add-member`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
groupId:selectedGroup._id,
userId:selected._id
})
}
);

const data = await res.json();

if(data.success){

setSelectedGroup(data.group);

setGroups(prev =>
prev.map(g =>
g._id === data.group._id ? data.group : g
)
);

alert(`${selected.name} added to group`);

}

}catch(err){
console.log(err);
}

};

/* ================= REMOVE MEMBER ================= */

const handleRemoveMemberFromGroup = async (memberId) => {

if(!selectedGroup) return;

try{

const res = await fetch(
`${process.env.REACT_APP_API_URL}/chat/group/remove-member`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
groupId:selectedGroup._id,
userId:memberId
})
}
);

const data = await res.json();

if(data.success){
setSelectedGroup(data.group);
}

}catch(err){
console.log(err);
}

};

/* ================= SEND MESSAGE ================= */

const sendMessage = () => {

if (!text.trim() || (!selectedUser && !selectedGroup)) return;

socket.emit("sendMessage", {
  sender: user._id,
  receiver: selectedUser?._id,
  groupId: selectedGroup?._id,
  text: text.trim(),
});

setText("");

};

/* ================= FILE UPLOAD ================= */

const handleFileUpload = async (e) => {

  const files = e.target.files;

  if (!files || files.length === 0 || (!selectedUser && !selectedGroup)) return;

  for (let file of files) {

    const formData = new FormData();
    formData.append("file", file);

    try {

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        }
      );

      const data = await res.json();

      socket.emit("sendMessage", {
        sender: user._id,
        receiver: selectedUser?._id,
        groupId: selectedGroup?._id,
        fileUrl: data.url,
        fileType: file.type,
        fileName: file.name
      });

    } catch (error) {
      console.log(error);
    }

  }
e.target.value = null;
};

/* ================= CREATE GROUP ================= */

const handleCreateGroup = async () => {

const name = prompt("Enter Group Name");

if (!name) return;

try {

  await fetch(
    `${process.env.REACT_APP_API_URL}/chat/group/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        name,
        members: []
      })
    }
  );

  alert("Group Created");

} catch (err) {

  console.log(err);

}

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



/* Delete Group */
const handleDeleteGroup = async () => {
  if (!selectedGroup) return;

  const confirmDelete = window.confirm("Delete this group?");
  if (!confirmDelete) return;

  try {

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/group/${selectedGroup._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {

      alert("Group deleted");

      setGroups(prev =>
        prev.filter(g => g._id !== selectedGroup._id)
      );

      setSelectedGroup(null);
      setMessages([]);

    }

  } catch (error) {
    console.log(error);
  }
};



/* ================= SEARCH ================= */

const filteredUsers = users.filter((u) =>
u.name.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
<div className="campus-view-root">

<Navbar />

<main className="chat-interface-wrapper">

<div className="chat-glass-panel">

<div className="row g-0 h-100">

<div className="col-md-4 chat-sidebar border-end">

<div className="sidebar-brand-box">

<h5>Messages</h5>

<span className="online-tag">
Students ({totalStudents}) • Online ({onlineUsers.length})
</span>

</div>

<div style={{ padding: "10px 15px" }}>
<button
onClick={handleCreateGroup}
className="btn btn-primary w-100 mb-2"
>
+ Create Group
</button>

<input
type="text"
placeholder="Search student..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
style={{
width: "100%",
padding: "8px 12px",
borderRadius: "10px",
border: "1px solid #ddd"
}}
/>
</div>

<div className="user-scroller">

{filteredUsers.map((u) => (

<div
key={u._id}
className={`user-pill ${
selectedUser?._id === u._id ? "pill-active" : ""
}`}
onClick={() => openChat(u)}
>

<div className="avatar-box">
  {u.profilePic ? (
    <img
      src={u.profilePic}
      alt="profile"
      className="chat-avatar-img"
    />
  ) : (
    u.name.charAt(0)
  )}

  {onlineUsers.includes(u._id) && (
    <span className="online-indicator"></span>
  )}
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

{groups.map((g) => (

<div
key={g._id}
className={`user-pill ${
selectedGroup?._id === g._id ? "pill-active" : ""
}`}
onClick={() => openGroup(g)}
>

<div className="avatar-box">👥</div>

<div className="user-info-text">
<p className="m-0 fw-bold">{g.name}</p>
<small>Group Chat</small>
</div>

</div>

))}

</div>

</div>

<div className="col-md-8 d-flex flex-column chat-viewport">

{selectedUser || selectedGroup ? (

<>
<div className="viewport-header d-flex justify-content-between align-items-center">

<div className="d-flex align-items-center">

<div className="avatar-sm">
  {selectedUser?.profilePic ? (
    <img
      src={selectedUser.profilePic}
      alt="profile"
      className="chat-avatar-img"
    />
  ) : (
    selectedUser?.name?.charAt(0) || "G"
  )}
</div>

<div>

<h6 className="m-0 fw-bold">
{selectedUser?.name || selectedGroup?.name}
</h6>

{typingUser === selectedUser?._id && (
  <small style={{ color: "green" }}>
    typing...
  </small>
)}

{selectedGroup && (
<>
<div style={{marginTop:"6px", display:"flex", gap:"10px"}}>

<button
onClick={()=>setShowMembers(!showMembers)}
className="btn btn-sm btn-secondary"
>
Members ({selectedGroup.members?.length})
</button>

<button
onClick={handleAddMemberToGroup}
className="btn btn-sm btn-success"
>
Add Member
</button>

</div>

{showMembers && (
<div style={{
marginTop:"10px",
background:"#f7f7f7",
padding:"10px",
borderRadius:"10px"
}}>

{selectedGroup.members?.map((m)=>(
<div key={m._id} style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"8px"
}}>

<div style={{
width:"28px",
height:"28px",
borderRadius:"50%",
background:"#25d366",
color:"white",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"600"
}}>
{m.name.charAt(0)}
</div>

<span style={{flex:1}}>
{m.name}
</span>

<button
onClick={()=>handleRemoveMemberFromGroup(m._id)}
className="btn btn-sm btn-outline-danger"
>
remove
</button>

</div>
))}

</div>
)}

</>
)}

</div>

</div>

<button
onClick={handleDeleteChat}
className="btn btn-sm btn-outline-danger"
>
Delete Chat
</button>

{selectedGroup && (
  <button
    onClick={handleDeleteGroup}
    className="btn btn-sm btn-danger ms-2"
  >
    Delete Group
  </button>
)}

</div>

<div className="messages-flow">

{messages.map((m) => {

const isMe =
m.sender?.toString() === user._id?.toString();

return (

<div
key={m._id}
className={`msg-wrapper ${
isMe ? "msg-me" : "msg-them"
}`}
>

<div className="msg-bubble">

{m.text}

{m.fileUrl && (

<a href={m.fileUrl} target="_blank" rel="noreferrer">

{m.fileType?.startsWith("image") && (
<img src={m.fileUrl} width="200" alt="media" />
)}

{m.fileType?.startsWith("video") && (
<video src={m.fileUrl} controls width="200" />
)}

{!m.fileType?.startsWith("image") &&
!m.fileType?.startsWith("video") && (

<div>
📄 {m.fileName}
</div>

)}

</a>

)}

</div>

</div>

);

})}

<div ref={messagesEndRef}></div>

</div>

<div className="viewport-footer">

<div className="input-pill">

<input
value={text}
onChange={(e) => {

setText(e.target.value);

if(selectedUser){
socket.emit("typing", {
sender: user._id,
receiver: selectedUser._id
});
}

}}
onBlur={() => {

if(selectedUser){
socket.emit("stopTyping", {
sender: user._id,
receiver: selectedUser._id
});
}

}}
onKeyDown={(e) => e.key === "Enter" && sendMessage()}
placeholder="Write a message..."
/>

<input
  type="file"
  id="fileUpload"
  multiple
  style={{ display: "none" }}
  onChange={handleFileUpload}
/>

<label htmlFor="fileUpload" className="wa-attach">
  📎
</label>

<button
  onClick={sendMessage}
  className="wa-send"
>
  ➤
</button>

</div>

</div>

</>

) : (

<div className="chat-empty-state">
<div className="empty-icon">K</div>
<p>Select a peer to start chatting</p>
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