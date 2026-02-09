# Projexa-College-Project
# 🎓 Campus Connect  
### College Social & Placement Network System (MERN Stack)

CampusConnect is a **full-stack MERN web application** designed for colleges to create a centralized platform for:

- Student interaction  
- Placement communication  
- Academic announcements  
- Real-time chat  
- Admin moderation  

It combines features of **social media + placement portal + academic communication system** into one secure platform.

---

## 🚀 Features

### 👤 User Management
- Student, Admin, Faculty, Placement Officer roles  
- Secure authentication using JWT  
- Admin approval system for users  

### 📰 Social Feed
- Students can create posts  
- Image upload using Cloudinary  
- Admin post approval  
- News feed display  

### 💼 Placement System
- Placement officers can post jobs  
- Student filtering based on:
  - Department  
  - Marks  
  - Backlogs  
- Job notifications to students  

### 💬 Real-Time Chat
- Live messaging using Socket.io  

### 🔔 Notifications
- Job alerts  
- System updates  

### 🎨 Interactive UI
- Animated pages using Framer Motion  
- Responsive design  

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js, Framer Motion, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Realtime | Socket.io |
| Authentication | JWT, Bcrypt |
| Image Upload | Cloudinary |
| Version Control | Git & GitHub |

---

## 📁 Project Structure
campusconnect/
│
├── backend/
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
└── frontend/
├── src/
│ ├── pages/
│ ├── api.js
│ └── App.js
