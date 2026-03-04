import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/AuthApi";
import toast from "react-hot-toast";
import "./Login.css"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("student");
  
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading(`Creating ${userRole} account...`);
    try {
      const res = await registerUser({ name, email, password, role: userRole });
      toast.success(res.data.message || "Registration Successful!", { id: loadToast });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", { id: loadToast });
    }
  };

  return (
    <div className="auth-zone-wrapper">
      {/* THICK CORNER GLOWS - These will now show up */}
      <div className="corner-glow top-left"></div>
      <div className="corner-glow top-right"></div>
      <div className="corner-glow bottom-left"></div>
      <div className="corner-glow bottom-right"></div>

      {/* TOP-LEFT BRANDING */}
      <header className="az-header-top-left">
        <div className="az-logo-container">
          <div className="az-logo-icon">K</div>
          <div className="az-logo-pulse"></div>
        </div>
        <div className="az-brand-text">
          <h1>K.R. MANGALAM <span>UNIVERSITY</span></h1>
          <p>Campus Connect Portal</p>
        </div>
      </header>

      <main className="auth-zone-main">
        <div className="az-card-wrapper">
          <div className="az-card">
            
            {/* THE FIXED ROLE SWITCHER (Dynamic Columns) */}
            <div className="az-role-switcher register-switch">
              <button 
                type="button"
                className={userRole === "student" ? "az-role-btn active" : "az-role-btn"} 
                onClick={() => setUserRole("student")}
              >
                Student
              </button>
              <button 
                type="button"
                className={userRole === "admin" ? "az-role-btn active" : "az-role-btn"} 
                onClick={() => setUserRole("admin")}
              >
                Admin
              </button>
            </div>

            <div className="az-intro">
              <h2>Join Us</h2>
              <p>Create your <span className="text-orange">{userRole}</span> profile</p>
            </div>

            <form onSubmit={handleSubmit} className="az-form">
              <div className="az-input-group">
                <i className="bi bi-person-fill"></i>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="az-input-group">
                <i className="bi bi-envelope-at-fill"></i>
                <input type="email" placeholder="University Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="az-input-group">
                <i className="bi bi-lock-fill"></i>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="az-btn-primary">
                Create Account <i className="bi bi-arrow-right-short"></i>
              </button>
            </form>

            <div className="az-signup-prompt">
              <p>Already a member? <Link to="/" className="az-signup-btn">Sign In</Link></p>
            </div>
          </div>

         
        </div>
      </main>
    </div>
  );
};

export default Register;